// src/pages/store/BrandGenieStore.tsx
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AlertTriangle } from 'lucide-react';

interface App {
  icon: JSX.Element;
  title: string;
  description: string;
  link: string;
  drafts: number;
}

// Shared explanation text for all apps
const generateReviewMessage = (appName: string) =>
  `The ${appName} team is currently reviewing our application to get access to the API key to be used for this project. We are in close contact with their team and have introduced our app. Due to project time constraints, access to this app will be implemented in the future after approval. More details are available in the project report.`;

const marketingApps: App[] = [
  {
    icon: <img src="https://cdn.simpleicons.org/hubspot" alt="Hubspot" className="w-8 h-8" />,
    title: 'Hubspot',
    description: 'CRM & email marketing automation.',
    link: generateReviewMessage('Hubspot'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/mailchimp" alt="Mailchimp" className="w-8 h-8" />,
    title: 'Mailchimp',
    description: 'Email campaigns & automation.',
    link: generateReviewMessage('Mailchimp'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/semrush" alt="SEMRush" className="w-8 h-8" />,
    title: 'SEMRush',
    description: 'SEO & competitor analysis.',
    link: generateReviewMessage('SEMRush'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/salesforce" alt="Salesforce" className="w-8 h-8" />,
    title: 'Salesforce',
    description: 'CRM and campaign tracking.',
    link: generateReviewMessage('Salesforce'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/zapier" alt="Zapier" className="w-8 h-8" />,
    title: 'Zapier',
    description: 'Automate workflows across apps.',
    link: generateReviewMessage('Zapier'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/buffer" alt="Buffer" className="w-8 h-8" />,
    title: 'Buffer',
    description: 'Schedule and publish social content.',
    link: generateReviewMessage('Buffer'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/hootsuite" alt="Hootsuite" className="w-8 h-8" />,
    title: 'Hootsuite',
    description: 'Social media management.',
    link: generateReviewMessage('Hootsuite'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/slack" alt="Slack" className="w-8 h-8" />,
    title: 'Slack',
    description: 'Team collaboration and messaging.',
    link: generateReviewMessage('Slack'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/discord" alt="Discord" className="w-8 h-8" />,
    title: 'Discord',
    description: 'Community communication.',
    link: generateReviewMessage('Discord'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/asana" alt="Asana" className="w-8 h-8" />,
    title: 'Asana',
    description: 'Project management for teams.',
    link: generateReviewMessage('Asana'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/campaignmonitor" alt="Campaign Monitor" className="w-8 h-8" />,
    title: 'Campaign Monitor',
    description: 'Email templates & campaigns.',
    link: generateReviewMessage('Campaign Monitor'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/intercom" alt="Intercom" className="w-8 h-8" />,
    title: 'Intercom',
    description: 'Customer messaging platform.',
    link: generateReviewMessage('Intercom'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/typeform" alt="Typeform" className="w-8 h-8" />,
    title: 'Typeform',
    description: 'Interactive forms and surveys.',
    link: generateReviewMessage('Typeform'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/googleanalytics" alt="Google Analytics" className="w-8 h-8" />,
    title: 'Google Analytics',
    description: 'Track website traffic & conversions.',
    link: generateReviewMessage('Google Analytics'),
    drafts: 0,
  },

  {
    icon: <img src="https://cdn.simpleicons.org/clickup" alt="ClickUp" className="w-8 h-8" />,
    title: 'ClickUp',
    description: 'All-in-one project workspace.',
    link: generateReviewMessage('ClickUp'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/airtable" alt="Airtable" className="w-8 h-8" />,
    title: 'Airtable',
    description: 'Organize marketing data visually.',
    link: generateReviewMessage('Airtable'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/squarespace" alt="Squarespace" className="w-8 h-8" />,
    title: 'Squarespace',
    description: 'Website builder for campaigns.',
    link: generateReviewMessage('Squarespace'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/shopify" alt="Shopify" className="w-8 h-8" />,
    title: 'Shopify',
    description: 'Ecommerce store platform.',
    link: generateReviewMessage('Shopify'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/figma" alt="Figma" className="w-8 h-8" />,
    title: 'Figma',
    description: 'Collaborative interface design.',
    link: generateReviewMessage('Figma'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/vimeo" alt="Vimeo" className="w-8 h-8" />,
    title: 'Vimeo',
    description: 'Video hosting & streaming.',
    link: generateReviewMessage('Vimeo'),
    drafts: 0,
  },
  {
    icon: <img src="https://cdn.simpleicons.org/youtube" alt="YouTube" className="w-8 h-8" />,
    title: 'YouTube',
    description: 'Video marketing and promotion.',
    link: generateReviewMessage('YouTube'),
    drafts: 0,
  },
];

const BrandGenieStore: React.FC = () => {
  const handleAppClick = (app: App) => {
    toast.info(app.link, {
      position: 'top-right',
      autoClose: 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="relative p-6">
      {/* Disclaimer Message */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4 z-10">
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md px-4 py-3 text-sm font-medium opacity-80 shadow-sm flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          The apps listed below are in review. We’ve introduced our platform to their teams and are awaiting access approvals. Features will be added once API access is granted. Details are in the project report.
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6 mt-24 text-center">BrandGenie App Store</h2>

      {/* Grid of Apps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {marketingApps.map((app, index) => (
          <div
            key={index}
            onClick={() => handleAppClick(app)}
            className="bg-white p-4 rounded shadow hover:bg-blue-50 cursor-pointer transition"
          >
            <div className="flex items-center space-x-2 mb-2">
              {app.icon}
              <span className="font-medium text-sm">{app.title}</span>
            </div>
            <p className="text-xs text-gray-600">{app.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandGenieStore;
