import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

// images
import notionLogo from '../../images/notion.png';
import copilotLogo from '../../images/copilot.png';
import canvasLogo from '../../images/canvas.png';
import teamsLogo from '../../images/teams.png';
import googleLogo from '../../images/google.png';
import capcutLogo from '../../images/capcut.png';
import googledriveLogo from '../../images/googledrive.png';
import trelloLogo from '../../images/trello.png';

interface Tool {
  id: number;
  title: string;
  description: string;
  link: string;
  logo_url: string;
}

interface ToolPermission {
  id: number;
  tool_id: number;
  user_id: number;
  access_start: string;
  access_end: string;
}

const MyToolsPage: React.FC = () => {
  const { user } = useUser();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  const logoMap: { [key: string]: string } = {
    notion: notionLogo,
    copilot: copilotLogo,
    canvas: canvasLogo,
    teams: teamsLogo,
    google: googleLogo,
    capcut: capcutLogo,
    googledrive: googledriveLogo,
    trello: trelloLogo,
  };

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const [toolsRes, permissionsRes] = await Promise.all([
          axios.get('/tools/'),
          axios.get('/tools/permissions/tools')
        ]);

        const permissions: ToolPermission[] = permissionsRes.data;
        const userToolIds = permissions
          .filter(p => p.user_id === user?.id)
          .map(p => p.tool_id);

        const filteredTools = toolsRes.data.filter((tool: Tool) =>
          userToolIds.includes(tool.id)
        );

        setTools(filteredTools);
      } catch (error) {
        console.error('Error fetching tools or permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTools();
  }, [user]);

  const handleToolClick = (link: string) => {
    window.location.href = link; // open in same tab
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">My Tools</h2>

      {loading ? (
        <p className="text-gray-600 text-center">Loading tools...</p>
      ) : tools.length === 0 ? (
        <p className="text-gray-500 text-center">You don't have any tools assigned.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const logo =
              logoMap[tool.title.toLowerCase()] || tool.logo_url || '';

            return (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool.link)}
                className="cursor-pointer bg-gray-50 p-4 rounded-lg shadow-sm border hover:shadow-md transition"
              >
                {logo && (
                  <img
                    src={logo}
                    alt={`${tool.title} logo`}
                    className="w-14 h-14 object-contain mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-800">{tool.title}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default MyToolsPage;
