import { Icons } from '@/components/Icons';
import { IntervalE } from '../types/enums';

const configuration = {
  routes: [
    { title: 'Overview', link: '/dashboard/main', icon: Icons.Home },
    { title: 'Agents', link: '/dashboard/agents', icon: Icons.Users },
    { title: 'Todos', link: '/dashboard/todos/create', icon: Icons.Laptop },
    { title: 'Knowledge', link: '/dashboard/knowledge', icon: Icons.Command },
    { title: 'Playground', link: '/dashboard/ai', icon: Icons.Bot },
    { title: 'History', link: '/dashboard/history', icon: Icons.Check },
    { title: 'Settings', link: '/dashboard/settings/profile', icon: Icons.Settings }
  ],
  subroutes: {
    todos: [
      { title: 'Create', link: '/dashboard/todos/create' },
      { title: 'My Todos', link: '/dashboard/todos/my-todos' },
      { title: 'All Todos', link: '/dashboard/todos/list-todos' }
    ],
    settings: [
      { title: 'Profile', link: '/dashboard/settings/profile' },
      { title: 'Billing', link: '/dashboard/settings/billing' },
      { title: 'Subscription', link: '/dashboard/settings/subscription' }
    ]
  },
  products: [
    {
      name: 'Base',
      description: 'Ideal for small dealerships or individual use',
      features: [
        'Limit of 200 calls per month',
        'Comprehensive Call Reports',
        'Customizable Call Scripts',
        'Email Support',
        'Each call is 29 cents per minute'
      ],
      plans: [
        {
          name: 'Base Monthly',
          interval: IntervalE.MONTHLY,
          price: '799',
          price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASE_MONTHLY,
          isPopular: true
        },
        {
          name: 'Base Annual',
          interval: IntervalE.YEARLY,
          price: '7990',
          price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASE_ANNUAL,
          isPopular: false
        }
      ]
    },
    {
      name: 'Medium Size',
      description: 'Perfect for medium-sized dealerships',
      features: [
        'Up to 500 calls per month',
        'Comprehensive Call Reports',
        'Customizable Call Scripts',
        'Integration with CRM systems',
        'Priority Email Support',
        'Each call is 29 cents per minute',
        'Purchase a phone number'
      ],
      plans: [
        {
          name: 'Medium Monthly',
          interval: IntervalE.MONTHLY,
          price: '1299',
          price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MEDIUM_MONTHLY,
          isPopular: false
        },
        {
          name: 'Medium Annual',
          interval: IntervalE.YEARLY,
          price: '12990',
          price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MEDIUM_ANNUAL,
          isPopular: false
        }
      ]
    },
    {
      name: 'Platinum',
      description: 'Best for large dealerships',
      features: [
        'Up to 1000 calls per month',
        'Comprehensive Call Reports',
        'Customizable Call Scripts',
        'Integration with CRM systems',
        'Phone and Email Support',
        'Each call is 29 cents per minute',
        'Purchase a phone number'
      ],
      plans: [
        {
          name: 'Platinum Monthly',
          interval: IntervalE.MONTHLY,
          price: '1999',
          price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PLATINUM_MONTHLY,
          isPopular: false
        },
        {
          name: 'Platinum Annual',
          interval: IntervalE.YEARLY,
          price: '19990',
          price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PLATINUM_ANNUAL,
          isPopular: false
        }
      ]
    }
  ]
};

export default configuration;