import uuid
from django.db import models, transaction
from django.conf import settings


# 🏷️ CATEGORY MODEL (PREDEFINED)
class Category(models.Model):
    CATEGORY_CHOICES = [
        ("conference", "Conference"),
        ("workshop", "Workshop"),
        ("concert", "Concert"),
        ("meetup", "Meetup"),
    ]

    name = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        unique=True
    )

    def __str__(self):
        return self.get_name_display()


# 📅 EVENT MODEL
class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="events"
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    capacity = models.PositiveIntegerField(default=0)

    # ✅ REQUIRED CATEGORY
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,   # prevents deleting used categories
        related_name="events"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    # ✅ CAPACITY HELPERS (FIXES YOUR ERROR)
    @property
    def confirmed_count(self):
        return self.registrations.filter(waitlist=False).count()

    @property
    def waitlist_count(self):
        return self.registrations.filter(waitlist=True).count()


# 📝 REGISTRATION MODEL (ATOMIC + SAFE)
class Registration(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="registrations"
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="registrations"
    )

    waitlist = models.BooleanField(default=False)
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "event")

    def save(self, *args, **kwargs):
        with transaction.atomic():
            confirmed_count = (
                Registration.objects
                .select_for_update()
                .filter(event=self.event, waitlist=False)
                .count()
            )

            self.waitlist = confirmed_count >= self.event.capacity

            super().save(*args, **kwargs)


# 💬 COMMENT MODEL
class Comment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.event}"
    
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("registration", "Registration"),
        ("waitlist", "Waitlist"),
        ("promotion", "Promotion"),
        ("event_update", "Event Update"),
        ("reminder", "Reminder"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    title = models.CharField(max_length=255)
    message = models.TextField()

    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES
    )

    is_read = models.BooleanField(default=False)

    # optional: link to event
    event = models.ForeignKey(
        "events.Event",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.title}"