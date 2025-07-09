
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolCard from '../../components/ToolCard';
import { MdAdd } from 'react-icons/md';
import * as toolApi from '../../api/tools';

// images
import notionLogo from '../../images/notion.png';
import copilotLogo from '../../images/copilot.png';
import canvasLogo from '../../images/canvas.png';
import teamsLogo from '../../images/teams.png';
import googleLogo from '../../images/google.png';
import capcutLogo from '../../images/capcut.png';
import googledriveLogo from '../../images/googledrive.png';
import trelloLogo from '../../images/trello.png';

const ToolsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState<any[]>([]);
  const draftCount = localStorage.getItem('notion_current_draft') ? 1 : 0;

  const predefinedTools = [
    {
      title: 'Notion',
      description: 'Write briefs, docs, and project notes',
      link: '/tools/notion',
      logo_url: notionLogo,
    },
    {
      title: 'Google Calendar',
      description: 'Plan campaigns with a shared calendar',
      link: '/tools/googlecalender/google',
      logo_url: googleLogo,
    },
    {
      title: 'Teams',
      description: 'Video meetings and recordings for teams',
      link: '/tools/teams',
      logo_url: teamsLogo,
    },
    {
      title: 'CoPilot',
      description: 'Generate captions, hashtags and headlines',
      link: '/tools/copilot',
      logo_url: copilotLogo,
    },
    {
      title: 'CapCut',
      description: 'Edit and customise promotional videos',
      link: '/tools/capcut',
      logo_url: capcutLogo,
    },
    {
      title: 'Trello',
      description: 'Organise teams workflow',
      link: '/tools/trello',
      logo_url: trelloLogo,
    },
    {
      title: 'Google Drive',
      description: 'Organise and store projects and images',
      link: '/tools/drive',
      logo_url: googledriveLogo,
    },
    {
      title: 'Canvas',
      description: 'Creative workspace for brand content',
      link: '/tools/canvas',
      logo_url: canvasLogo,
    },
  ];

  useEffect(() => {
    syncAndFetchTools();
  }, []);

  const syncAndFetchTools = async () => {
    try {
      const res = await toolApi.getTools();
      const existingTitles = res.data.map((t: any) => t.title);

      // Send missing ones to backend
      const newOnes = predefinedTools.filter(
        (t) => !existingTitles.includes(t.title)
      );

      for (const tool of newOnes) {
        await toolApi.addTool({
          ...tool,
          logo_url: tool.logo_url, // You may convert to CDN later
        });
      }

      // Fetch all tools after sync
      const finalTools = await toolApi.getTools();
      setTools(finalTools.data);
    } catch (err) {
      console.error('Error syncing tools:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.link}
            icon={<img src={tool.logo_url} alt={tool.title} className="w-12 h-12" />}
            title={tool.title}
            description={tool.description}
            link={tool.link}
            drafts={tool.title === 'Notion' ? draftCount : 0}
          />
        ))}

        <div
          onClick={() => navigate('/tools/store')}
          className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition"
        >
          <MdAdd className="text-5xl text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">Add more tools</p>
          <p className="text-xs text-gray-400 mt-1">(Browse BrandGenie Store)</p>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
