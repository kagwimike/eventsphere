from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.decorators import api_view

from .models import Event, Registration, Category, Comment, Notification
from .serializers import (
    EventSerializer,
    RegistrationSerializer,
    CategorySerializer,
    CommentSerializer,
    NotificationSerializer
)

from .permissions import IsOwnerOrReadOnly

# ----------------------------
# 📅 EVENTS
# ----------------------------
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by("-start_time")
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_update(self, serializer):
        event = serializer.save()
        confirmed_users = event.registrations.filter(waitlist=False)

        for reg in confirmed_users:
            Notification.objects.create(
                user=reg.user,
                title="Event Updated",
                message=f"{event.title} has been updated",
                notification_type="event_update",
                event=event,
            )
            try:
                send_mail(
                    f"📢 Event Updated: {event.title}",
                    f"Hello {reg.user.username},\n\nThe event '{event.title}' has been updated.",
                    settings.DEFAULT_FROM_EMAIL,
                    [reg.user.email],
                    fail_silently=True,
                )
            except:
                pass

# ----------------------------
# 📝 REGISTRATION
# ----------------------------
class RegisterEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        try:
            event = Event.objects.select_for_update().get(id=pk)
        except Event.DoesNotExist:
            return Response({"detail": "Event not found"}, status=404)

        if Registration.objects.filter(user=request.user, event=event).exists():
            return Response({"detail": "You are already registered"}, status=400)

        confirmed_count = event.registrations.filter(waitlist=False).count()
        is_full = confirmed_count >= event.capacity

        registration = Registration.objects.create(
            user=request.user,
            event=event,
            waitlist=is_full
        )

        Notification.objects.create(
            user=request.user,
            title="Added to Waitlist" if is_full else "Registration Confirmed",
            message=f"Status updated for {event.title}",
            notification_type="waitlist" if is_full else "registration",
            event=event
        )

        return Response({"message": "Registered successfully", "waitlist": registration.waitlist}, status=201)

class UnregisterEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def delete(self, request, pk):
        registration = Registration.objects.filter(user=request.user, event_id=pk).first()
        if not registration:
            return Response({"detail": "Not registered"}, status=400)
        
        event = registration.event
        registration.delete()

        next_user = Registration.objects.filter(event=event, waitlist=True).order_by("registered_at").first()
        if next_user:
            next_user.waitlist = False
            next_user.save()
            Notification.objects.create(user=next_user.user, title="You're In!", event=event)

        return Response({"detail": "Unregistered successfully"}, status=200)

# ✅ ADDED THIS MISSING VIEW
class EventRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(event_id=self.kwargs.get("pk"))

# ----------------------------
# 💬 COMMENTS, CATEGORIES & NOTIFICATIONS
# ----------------------------
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(event_id=self.kwargs.get("pk")).order_by("-created_at")

    def perform_create(self, serializer):
        # The fix: Ensure the user and event are explicitly saved
        serializer.save(
            user=self.request.user, 
            event_id=self.kwargs.get("pk")
        )

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class EventByCategoryView(generics.ListAPIView):
    serializer_class = EventSerializer
    def get_queryset(self):
        cat_id = self.request.query_params.get("category")
        return Event.objects.filter(category_id=cat_id) if cat_id else Event.objects.all()

class UserNotificationsView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")

class MarkNotificationReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    def perform_update(self, serializer):
        serializer.save(is_read=True)


@api_view(["PATCH"])
def mark_all_notifications_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({"message": "All marked as read"})