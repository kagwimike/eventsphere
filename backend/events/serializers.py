from django.conf import settings
from django.core.mail import send_mail
from rest_framework import serializers

from .models import Category, Comment, Event, Notification, Registration


class RegistrationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    event = serializers.PrimaryKeyRelatedField(read_only=True)
    event_title = serializers.CharField(source="event.title", read_only=True)

    class Meta:
        model = Registration
        fields = ["id", "user", "event", "event_title", "waitlist", "registered_at"]
        read_only_fields = ["id", "user", "event", "event_title", "waitlist", "registered_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        event = self.context.get("event")

        if not request or not event:
            raise serializers.ValidationError("Registration context is incomplete.")

        user = request.user
        validated_data.update({"user": user, "event": event})

        confirmed_count = event.registrations.filter(waitlist=False).count()
        validated_data["waitlist"] = event.capacity > 0 and confirmed_count >= event.capacity
        status = "waitlist" if validated_data["waitlist"] else "confirmed"

        registration = super().create(validated_data)

        try:
            if status == "confirmed":
                subject = f"✅ Registration Confirmed: {event.title}"
                message = (
                    f"Hello {user.username},\n\n"
                    f"You have successfully registered for:\n\n"
                    f"📅 {event.title}\n"
                    f"📍 {event.location}\n"
                    f"⏰ {event.start_time}\n\n"
                    "We look forward to seeing you!\n\n"
                    "— EventSphere Team"
                )
            else:
                subject = f"⏳ Added to Waitlist: {event.title}"
                message = (
                    f"Hello {user.username},\n\n"
                    f'The event "{event.title}" is currently full.\n\n'
                    "You have been placed on the WAITLIST.\n"
                    "We will notify you if a slot becomes available.\n\n"
                    "— EventSphere Team"
                )

            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except Exception:
            pass

        return registration


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    event = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "content", "created_at", "event"]
        read_only_fields = ["user", "created_at", "event"]


class EventSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), write_only=True)
    category_id = serializers.IntegerField(source="category.id", read_only=True)
    category_details = CategorySerializer(source="category", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    registrations = RegistrationSerializer(many=True, read_only=True)
    confirmed_count = serializers.SerializerMethodField()
    waitlist_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "location",
            "start_time",
            "end_time",
            "capacity",
            "owner",
            "category",
            "category_id",
            "category_details",
            "comments",
            "registrations",
            "confirmed_count",
            "waitlist_count",
            "created_at",
            "updated_at",
            "is_active",
        ]

    def validate(self, attrs):
        start_time = attrs.get("start_time")
        end_time = attrs.get("end_time")

        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError({"end_time": "End time must be after start time."})

        return attrs

    def get_confirmed_count(self, obj):
        return obj.registrations.filter(waitlist=False).count()

    def get_waitlist_count(self, obj):
        return obj.registrations.filter(waitlist=True).count()


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "user", "message", "is_read", "created_at"]