from django.contrib.auth.models import User
from django.db import models


class Day(models.Model):
    PUBLIC = "public"
    PRIVATE = "private"
    ACCESS_MODE_CHOICES = (
        (PUBLIC, "публічний"),
        (PRIVATE, "приватний"),
    )

    DAY_TYPE_CHOICES = (
        ("special", "особливий"),
        ("successful", "успішний"),
        ("ordinary", "звичайний"),
        ("boring", "нудний"),
        ("bad", "поганий"),
    )

    FEELING_CHOICES = (
        ("excellent", "відмінне"),
        ("good", "добре"),
        ("average", "середнє"),
        ("poor", "погане"),
        ("critical", "критичне"),
    )
    DAY_TYPE_EMOJI = {
        "special": "💖",
        "successful": "🏆",
        "ordinary": "🏡",
        "boring": "😴",
        "bad": "😞",
    }

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    title = models.CharField(max_length=100, null=True, blank=True)
    image_title = models.ImageField(
        upload_to="images/days_image_titles/", null=True, blank=True
    )
    text_description = models.TextField(null=True, blank=True)
    feeling = models.CharField(
        max_length=10, choices=FEELING_CHOICES, null=True, blank=True
    )
    access_mode = models.CharField(
        max_length=10, choices=ACCESS_MODE_CHOICES, default=PRIVATE
    )
    day_type = models.CharField(
        max_length=15, choices=DAY_TYPE_CHOICES, default="ordinary"
    )
    conclusion = models.TextField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "date")

    def __str__(self):
        return f"{self.user} | {self.date}"

    @property
    def images(self):
        return self.mediacontent_set.filter(content_type="image")

    @property
    def videos(self):
        return self.mediacontent_set.filter(content_type="video")

    @property
    def audio(self):
        return self.mediacontent_set.filter(content_type="audio")

    @property
    def access_modes_list(self):
        return [mode[1] for mode in self.ACCESS_MODE_CHOICES]

    @classmethod
    def day_types_list(cls):
        return [
            f"{cls.DAY_TYPE_EMOJI[day_type[0]]} {day_type[1]}"
            for day_type in cls.DAY_TYPE_CHOICES
        ]

    @classmethod
    def day_type_labels(cls):
        return [day_type[1] for day_type in cls.DAY_TYPE_CHOICES]

    @classmethod
    def feelings_list(cls):
        return [feeling[1] for feeling in cls.FEELING_CHOICES]

    @property
    def day_type_emoji(self):
        return self.DAY_TYPE_EMOJI[self.day_type]

    @property
    def feeling_description(self):
        match self.feeling:
            case "excellent":
                return (
                    "У мене високий рівень енергії, відмінна фізична та психічна витривалість. "
                    "Всі показники фізіологічного стану знаходяться в нормі. Я є активним і "
                    "здатним до виконання будь-яких фізичних та розумових завдань."
                )
            case "good":
                return (
                    "Я почуваю себе добре, здоров'я взагалі не заважає повсякденним справам. "
                    "Можливо, є дрібні незначні неприємності, "
                    "але вони не впливають значно на загальний стан здоров'я."
                )
            case "average":
                return (
                    "Відчуваю деякі ознаки втоми або невеликого нездужання. "
                    "Мій загальний стан задовільний, "
                    "але може виникати деяка обмеженість у моїх фізичних або психічних можливостях."
                )
            case "poor":
                return (
                    "Я відчуваю виражені симптоми нездужання, "
                    "які суттєво впливають на моє повсякденне функціонування. "
                    "Можливе виникнення болю, втоми та інших неприємних відчуттів. "
                    "Вимагає уваги та можливого лікування."
                )
            case "critical":
                return (
                    "Мій стан вважається тяжким. Важливі функції мого організму порушені,"
                    " існує ризик мого життя. Це вимагає негайної медичної допомоги та інтенсивного лікування. "
                    "Такий стан може бути спричинений серйозними травмами,"
                    " захворюваннями або іншими критичними станами, що загрожують моєму життю."
                )
            case _:
                return "Самопочуття не вказано."

    @classmethod
    def get_day_search_parameter(cls, search_parameter_display):
        parameters = {
            "Заголовок дня": 'title__icontains',
            "Опис дня": 'text_description__icontains',
            "Список справ": 'tasks__description__icontains',
            "Відвідані місця": 'visited_places__title__icontains',
            "Пов'язані люди": 'related_people__name__icontains',
            "Досягнення": 'achievements__text__icontains',
            "Життєві уроки": 'life_lessons__text__icontains',
            "Висновки": 'conclusion__icontains',
        }
        return parameters.get(search_parameter_display, None)


class Mood(models.Model):
    MOOD_EMOJI = {
        "happy": "😊",
        "in_love": "😍",
        "confident": "💪",
        "playful": "😄",
        "distressed": "😓",
        "indifferent": "😐",
        "angry": "😡",
        "fearful": "😱",
        "sad": "😔",
        "desperate": "😭",
    }

    MOOD_CHOICES = (
        ("happy", "щасливий"),
        ("in_love", "закоханий"),
        ("confident", "впевнений"),
        ("playful", "грайливий"),
        ("distressed", "збентежений"),
        ("indifferent", "байдужий"),
        ("angry", "злий"),
        ("fearful", "наляканий"),
        ("sad", "сумний"),
        ("desperate", "відчай"),
    )

    day = models.OneToOneField(Day, on_delete=models.CASCADE)
    morning_mood = models.CharField(
        max_length=15, choices=MOOD_CHOICES, null=True, blank=True
    )
    noon_mood = models.CharField(
        max_length=15, choices=MOOD_CHOICES, null=True, blank=True
    )
    evening_mood = models.CharField(
        max_length=15, choices=MOOD_CHOICES, null=True, blank=True
    )
    night_mood = models.CharField(
        max_length=15, choices=MOOD_CHOICES, null=True, blank=True
    )

    updated = models.DateTimeField(auto_now=True)

    @property
    def morning_mood_emoji(self):
        return self.MOOD_EMOJI.get(str(self.morning_mood), "")

    @property
    def noon_mood_emoji(self):
        return self.MOOD_EMOJI.get(str(self.noon_mood), "")

    @property
    def evening_mood_emoji(self):
        return self.MOOD_EMOJI.get(str(self.evening_mood), "")

    @property
    def night_mood_emoji(self):
        return self.MOOD_EMOJI.get(str(self.night_mood), "")

    @classmethod
    def moods_list(cls):
        return [f"{cls.MOOD_EMOJI[mood[0]]} {mood[1]}" for mood in cls.MOOD_CHOICES]


class Task(models.Model):
    TASK_STATUS_CHOICES = (
        ("failed", "не виконано"),
        ("completed", "виконано"),
    )
    day = models.ForeignKey(Day, related_name="tasks", on_delete=models.CASCADE)
    description = models.CharField(max_length=250)
    status = models.CharField(
        max_length=10, choices=TASK_STATUS_CHOICES, null=True, blank=True
    )
    execution_time = models.TimeField()

    class Meta:
        ordering = ["execution_time"]


class Weather(models.Model):
    day = models.OneToOneField(Day, on_delete=models.CASCADE)
    min_temperature = models.IntegerField()
    max_temperature = models.IntegerField()
    description = models.CharField(max_length=30)
    icon_url = models.URLField()


class MusicalComposition(models.Model):
    day = models.ForeignKey(
        Day, related_name="musical_compositions", on_delete=models.CASCADE
    )
    author = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    updated = models.DateTimeField(auto_now=True)


class RelatedPerson(models.Model):
    day = models.ForeignKey(
        Day, related_name="related_people", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    updated = models.DateTimeField(auto_now=True)


class Achievement(models.Model):
    day = models.ForeignKey(Day, related_name="achievements", on_delete=models.CASCADE)
    text = models.TextField()
    updated = models.DateTimeField(auto_now=True)


class LifeLesson(models.Model):
    day = models.ForeignKey(Day, related_name="life_lessons", on_delete=models.CASCADE)
    text = models.TextField()
    updated = models.DateTimeField(auto_now=True)


class VisitedPlace(models.Model):
    day = models.ForeignKey(
        Day, related_name="visited_places", on_delete=models.CASCADE
    )
    longitude = models.FloatField()
    latitude = models.FloatField()
    title = models.CharField(max_length=70)
    updated = models.DateTimeField(auto_now=True)


class MediaContent(models.Model):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    CONTENT_TYPE_CHOICES = (
        (IMAGE, "image"),
        (VIDEO, "video"),
        (AUDIO, "audio"),
    )
    day = models.ForeignKey(Day, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES)
    description = models.CharField(max_length=400, null=True, blank=True)
    file = models.FileField(upload_to="days/media_files/")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
