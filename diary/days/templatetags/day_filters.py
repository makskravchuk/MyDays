from django import template

register = template.Library()


@register.filter
def formate_date(date):
    months = {
        1: "січня",
        2: "лютого",
        3: "березня",
        4: "квітня",
        5: "травня",
        6: "червня",
        7: "липня",
        8: "серпня",
        9: "вересня",
        10: "жовтня",
        11: "листопада",
        12: "грудня",
    }
    return f"{date.day} {months[date.month]} {date.year} рік"
