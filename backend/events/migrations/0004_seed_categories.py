from django.db import migrations

def create_categories(apps, schema_editor):
    Category = apps.get_model('events', 'Category')

    categories = [
        "Conference",
        "Workshop",
        "Concert",
        "Meetup",
        "Webinar",
        "Seminar",
    ]

    for name in categories:
        Category.objects.get_or_create(name=name)

def reverse_categories(apps, schema_editor):
    Category = apps.get_model('events', 'Category')
    Category.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_category_alter_comment_options_alter_event_options_and_more'),  # keep yours
    ]

    operations = [
        migrations.RunPython(create_categories, reverse_categories),
    ]