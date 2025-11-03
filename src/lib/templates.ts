/**
 * Email templates for quick starts
 */

export const templates = {
  welcome: {
    name: 'Welcome Email',
    description: 'Onboarding new users',
    jsx: `<Heading as="h1" fontSize="36px" align="center" color="#1e40af">
  Welcome Aboard!
</Heading>

<Text fontSize="16px" align="left" color="#374151">
  We're excited to have you here. Let's get you started with the basics and help you make the most of your experience.
</Text>

<Button href="https://example.com/getting-started" bgColor="#3b82f6" textColor="#ffffff" padding="14px 28px">
  Get Started
</Button>

<Hr borderColor="#e5e7eb" borderWidth="1px" />

<Text fontSize="14px" align="center" color="#9ca3af">
  Need help? Reply to this email anytime.
</Text>`,
  },

  newsletter: {
    name: 'Newsletter',
    description: 'Weekly update template',
    jsx: `<Heading as="h2" fontSize="28px" align="left" color="#1f2937">
  This Week's Highlights
</Heading>

<Text fontSize="14px" align="left" color="#6b7280">
  Here are the top stories and updates from this week:
</Text>

<Text fontSize="14px" align="left" color="#374151">
  • Major product update released
  • New team members joined
  • Upcoming events and webinars
</Text>

<Hr borderColor="#e5e7eb" borderWidth="1px" />

<Button href="https://example.com/newsletter" bgColor="#10b981" textColor="#ffffff" padding="12px 24px">
  Read Full Newsletter
</Button>`,
  },

  promo: {
    name: 'Promotional',
    description: 'Sales and special offers',
    jsx: `<Heading as="h1" fontSize="36px" align="center" color="#dc2626">
  FLASH SALE - 50% OFF!
</Heading>

<Text fontSize="18px" align="center" color="#374151">
  Limited time offer - don't miss out on our biggest sale of the year.
</Text>

<Img src="https://via.placeholder.com/600x200" alt="Sale Banner" width="600" />

<Button href="https://example.com/sale" bgColor="#dc2626" textColor="#ffffff" padding="16px 32px">
  Shop Now
</Button>

<Text fontSize="12px" align="center" color="#9ca3af">
  Sale ends Sunday at midnight
</Text>`,
  },

  transactional: {
    name: 'Receipt/Confirmation',
    description: 'Order confirmations',
    jsx: `<Heading as="h2" fontSize="24px" align="left" color="#1f2937">
  Order Confirmed
</Heading>

<Text fontSize="14px" align="left" color="#374151">
  Thank you for your purchase! Your order #12345 has been confirmed and will ship soon.
</Text>

<Hr borderColor="#e5e7eb" borderWidth="2px" />

<Text fontSize="16px" align="left" color="#1f2937">
  Order Total: $99.99
</Text>

<Button href="https://example.com/orders/12345" bgColor="#3b82f6" textColor="#ffffff" padding="12px 24px">
  Track Your Order
</Button>`,
  },
};

export type TemplateKey = keyof typeof templates;
