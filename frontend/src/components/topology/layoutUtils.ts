import { TopologyNode } from '../../types';

export const calculateTopologyLayout = (nodes: TopologyNode[]) => {
  // Group by category/type
  const columns: Record<string, { x: number; nodes: TopologyNode[] }> = {
    user: { x: 50, nodes: [] },
    workstation: { x: 340, nodes: [] },
    application: { x: 630, nodes: [] },
    server: { x: 920, nodes: [] },
    database: { x: 1210, nodes: [] },
    security_system: { x: 1500, nodes: [] },
  };

  nodes.forEach((node) => {
    const colKey = node.type.toLowerCase();
    if (columns[colKey]) {
      columns[colKey].nodes.push(node);
    } else {
      columns.server.nodes.push(node);
    }
  });

  const positionedNodes: Record<string, { x: number; y: number }> = {};

  Object.values(columns).forEach((col) => {
    col.nodes.forEach((node, index) => {
      positionedNodes[node.id] = {
        x: col.x,
        y: 60 + index * 125,
      };
    });
  });

  return positionedNodes;
};
