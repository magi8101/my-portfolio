# EmailJS Configuration

This folder contains reference screenshots for setting up EmailJS with the portfolio contact form.

## Template Variables

The contact form uses the following template variables:

| Variable | Description |
|----------|-------------|
| `{{user_name}}` | Name of the person submitting the form |
| `{{user_email}}` | Email address of the sender |
| `{{message}}` | Message content from the form |

## Template Settings

### Email Settings
- **To Email:** Your email address (e.g., youre email adress.com)
- **From Name:** `{{user_name}}`
- **From Email:** `{{user_email}}`
- **Reply To:** `{{user_email}}`

### Template Content Example

```html
<p>Hello "youre name",</p>
<p>You've received a new message from {{user_email}} through the contact form on the website. Please find the details below:</p>
<p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">New message sent by {{user_name}} message <strong>{{message}}</strong></p>
<p>Best wishes,<br>"youre name"</p>
```

## Environment Variables

Add these to your `.env` file:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## Form Field Mapping

The contact form in `components/contact-section.tsx` uses these field names:

- `name="user_name"` - Maps to `{{user_name}}`
- `name="user_email"` - Maps to `{{user_email}}`
- `name="message"` - Maps to `{{message}}`

Ensure these names match the template variables in your EmailJS template for proper data binding.
