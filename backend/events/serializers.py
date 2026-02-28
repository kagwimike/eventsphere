from rest_framework import serializers
from .models import Event, Registration, Comment, Category, Notification
from django.core.mail import send_mail
from django.conf import settings

# ---------------------------
# 📝 REGISTRATION SERIALIZER
# ---------------------------
class RegistrationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    event = serializers.PrimaryKeyRelatedField(read_only=True)
    event_title = serializers.CharField(source="event.title", read_only=True)

    class Meta:
        model = Registration
        fields = ['id', 'user', 'event', 'event_title', 'waitlist', 'registered_at']
        read_only_fields = ['id', 'user', 'event', 'event_title', 'waitlist', 'registered_at']

    def create(self, validated_data):
        request = self.context.get("request")
        event = self.context.get("event")

        user = request.user if request else None

        # Attach user + event
        validated_data["user"] = user
        validated_data["event"] = event

        # 🔥 Check capacity
        confirmed_count = event.registrations.filter(waitlist=False).count()

        if confirmed_count >= event.capacity:
            validated_data["waitlist"] = True
            status = "waitlist"
        else:
            validated_data["waitlist"] = False
            status = "confirmed"

        registration = super().create(validated_data)

        # =========================
        # 📩 SEND EMAIL
        # =========================
        try:
            if status == "confirmed":
                subject = f"✅ Registration Confirmed: {event.title}"
                message = f"""
Hello {user.username},

You have successfully registered for:

📅 {event.title}
📍 {event.location}
⏰ {event.start_time}

We look forward to seeing you!

— EventSphere Team
"""
            else:
                subject = f"⏳ Added to Waitlist: {event.title}"
                message = f"""
Hello {user.username},

The event "{event.title}" is currently full.

You have been placed on the WAITLIST.
We will notify you if a slot becomes available.

— EventSphere Team
"""

            send_mail(
                subject,
                message,
            settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )

        except Exception as e:
            print("❌ Email failed:", str(e))

        return registration

# ---------------------------
# 🏷️ CATEGORY SERIALIZER
# ---------------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


# ---------------------------
# 💬 COMMENT SERIALIZER
# ---------------------------
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    event = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "content", "created_at", "event"]
        read_only_fields = ["user", "created_at", "event"]


# ---------------------------
# 📅 EVENT SERIALIZER (FIXED)
# ---------------------------
class EventSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    # ✅ WRITE: accept category ID from frontend
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True
    )

    # ✅ READ: return full category object
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

            # 👇 IMPORTANT
            "category",           # write (POST/PUT)
            "category_details",   # read (GET)

            "comments",
            "registrations",
            "confirmed_count",
            "waitlist_count",
            "created_at",
            "updated_at",
            "is_active",
        ]

    def get_confirmed_count(self, obj):
        return obj.registrations.filter(waitlist=False).count()

    def get_waitlist_count(self, obj):
        return obj.registrations.filter(waitlist=True).count()

# ---------------------------
# 🔔 NOTIFICATION SERIALIZER
# ---------------------------
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at']