from django.urls import path
from .views import (
    UserNotificationsView, 
    MarkNotificationReadView,
    EventListCreateView,
    EventRetrieveUpdateDestroyView,
    RegisterEventView,
    UnregisterEventView,
    CommentListCreateView,
    CategoryListView,
    EventByCategoryView,
    EventRegistrationsView,
    mark_all_notifications_read,
)

urlpatterns = [
    path("events/", EventListCreateView.as_view()),
    path("events/<uuid:pk>/", EventRetrieveUpdateDestroyView.as_view()),
    path("events/<uuid:pk>/register/", RegisterEventView.as_view()),
    path("events/<uuid:pk>/unregister/", UnregisterEventView.as_view()),
    path("events/<uuid:pk>/comments/", CommentListCreateView.as_view(), name="event-comments"),
    path("categories/", CategoryListView.as_view()),
    path("events/filter/", EventByCategoryView.as_view()),
    path("events/<uuid:pk>/registrations/", EventRegistrationsView.as_view(), name="event-registrations"),
       
       # Notification endpoints
    path("notifications/mark-all-read/", mark_all_notifications_read),
    path("notifications/", UserNotificationsView.as_view()),
    path("notifications/<uuid:pk>/read/", MarkNotificationReadView.as_view()),
    
]