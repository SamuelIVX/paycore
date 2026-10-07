# Demo login notice

## TL;DR

Show visitors that PayCore is a class project demo and provide its intentionally
public demo accounts beneath the login form.

## Behavior

- Inside the login card, after the form, show the heading “Class project demo”
  and “PayCore is a class project demo. Try it using either demo account below.”
- Display stacked Manager and Employee account blocks with labeled, selectable
  email and password text. The existing demo credentials are supplied by Sam.
- Match existing theme colors and spacing; wrap long credentials on narrow screens.
- Preserve login behavior and the directory link. No autofill, automatic login,
  database changes, or new dependencies.

## Verification

`app/__tests__/LoginPage.test.tsx` checks the notice, exact credentials, labels,
placement outside and after the form, the directory link, and empty login inputs.
Check the layout at mobile width in light and dark themes.
