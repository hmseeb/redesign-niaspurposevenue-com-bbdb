# Nia’s Purpose Venue — Website

A boutique, community-centered event space in Newark, New Jersey.

## Stack

Vanilla HTML / CSS / JS — no build step. `index.html` is the entry point; serve the
repository root as a static site.

```
index.html      single-page site (hero, about, services, packages, gallery,
                testimonials, why-us, contact/booking, footer)
styles.css      design system + all section styles, fully responsive
script.js       sticky header, mobile nav, scroll reveals, gallery lightbox, forms
favicon.svg     monogram favicon
images/source/  authentic venue photography reused from the previous site
```

## Forms

Both the hero "Check Availability" form and the main contact form post to
LeadrVision at `https://vision.leadrai.com/api/forms/bc6b767d75ca412e5f221640932d4869`.

- Plain HTML `POST` works with JavaScript disabled; the visitor returns with
  `?submitted=1` and the confirmation message is shown.
- With JavaScript, submission is intercepted and sent as JSON to the same URL,
  and the confirmation is shown inline.
- Each form carries `_form` (form name), `_page` (set to `window.location.href`
  on load and in the JSON body) and a hidden `_gotcha` honeypot field.

## Reviews

"Leave us a review" links point at the relative path `/review`, which is provided
by the hosting platform — it is not built in this repository.

## Contact

Newark, New Jersey · (218) 210-5410 · twalker@niaspurposellc.com
