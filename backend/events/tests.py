from django.test import TestCase
from django.utils import timezone

from events.models import Category, Event, Registration
from events.serializers import EventSerializer
from users.models import User


class EventSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="organizer",
            email="organizer@example.com",
            password="secure-pass-123",
        )
        self.category = Category.objects.create(name="conference")

    def test_event_serializer_rejects_end_time_before_start_time(self):
        payload = {
            "title": "Launch Event",
            "description": "A polished launch experience",
            "location": "Nairobi",
            "start_time": timezone.now() + timezone.timedelta(days=1),
            "end_time": timezone.now(),
            "capacity": 10,
            "category": self.category.id,
        }

        serializer = EventSerializer(data=payload)

        self.assertFalse(serializer.is_valid())
        self.assertIn("end_time", serializer.errors)


class RegistrationCapacityTests(TestCase):
    def setUp(self):
        self.organizer = User.objects.create_user(
            username="organizer2",
            email="organizer2@example.com",
            password="secure-pass-123",
        )
        self.attendee = User.objects.create_user(
            username="attendee",
            email="attendee@example.com",
            password="secure-pass-123",
        )
        self.category = Category.objects.create(name="workshop")
        self.event = Event.objects.create(
            owner=self.organizer,
            title="Design Sprint",
            description="A practical workshop",
            location="Nairobi",
            start_time=timezone.now(),
            end_time=timezone.now() + timezone.timedelta(hours=2),
            capacity=1,
            category=self.category,
        )

    def test_second_registration_is_marked_waitlist_when_capacity_is_full(self):
        first = Registration.objects.create(user=self.organizer, event=self.event)
        second = Registration.objects.create(user=self.attendee, event=self.event)

        self.assertFalse(first.waitlist)
        self.assertTrue(second.waitlist)
