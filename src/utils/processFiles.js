import { formatErrors } from './formatErrors';

export const processFiles = function (files) {
  if (!files || !files.length) {
    return [];
  }
  const errors = [];
  // todo refactor to take adjacency list as input
  // todo refactor to use topsort algo from IK
  function topologicalSort(name, nodes, edges) {
    // nodes are adjacency list keys
    // edges are adjacency list values
    console.log({ nodes, edges });
    const visited = new Array(nodes.length).fill(0); // TODO make this a set
    const result = [];

    function dfs(node) {
      if (visited[node] === -1) {
        // cycle detected
        errors.push({
          name,
          message: `check for problem involving: ${node}`,
        });
        return false;
      }
      if (visited[node] === 1) return true; // already visited

      visited[node] = -1; // mark as being visited

      for (const neighbor of edges[node] || []) {
        if (!dfs(neighbor)) return false;
      }

      visited[node] = 1; // mark as visited
      result.push(node);

      return true;
    }

    for (const node of nodes) {
      if (!dfs(node)) {
        console.error('DEBUG: CYCLE DETECTED', { node }, { errors });
        if (errors.length > 0) {
          throw new Error(formatErrors(errors));
        }
      }
    }

    console.log('result topsort', result.reverse());
    return result.reverse();
  }

  const fileMap = new Map();
  files.forEach((file) => fileMap.set(file.displayName, file.contents));

  // Create an adjacency map for phases to model it as a graph
  const phaseAdjacencyMap = new Map();
  fileMap
    .get('Phases')
    .forEach((phase) => phaseAdjacencyMap.set(phase.name, phase.prerequisites));

  // TODOO make ajacency maps for each phase
  const graphs = {};
  [...fileMap.keys()].forEach((fileName) => {
    if (fileName !== 'Phases') {
      const phaseName = fileName;
      const graph = {};
      fileMap
        .get(fileName)
        .forEach((stage) => (graph[stage.name] = stage.prerequisites));
      graphs[phaseName] = graph;
    }
  });

  console.log({ phaseGraph: phaseAdjacencyMap });
  // Perform topological sort on phase graph
  const orderedPhases = topologicalSort('Phases', phaseAdjacencyMap);
  // returns:
  // [
  //   "Feasibility",
  //   "Design",
  //   "Permitting",
  //   "Construction",
  // ]

  // Perform topological sort on each graph
  const orderedStages = {};
  Object.keys(graphs).forEach((phaseName) => {
    orderedStages[phaseName] = topologicalSort(
      phaseName,
      Object.keys(graphs[phaseName]),
      graphs[phaseName],
    );
  });

  console.log({ orderedPhases, orderedStages });

  // Combine ordered phases and stages
  const output = orderedPhases
    .map(
      (phase, i) =>
        `${i + 1} ${phase}\n${orderedStages[phase]
          .map((stage, j) => `${i + 1}.${j + 1} ${stage}`)
          .join('\n')}`,
    )
    .join('\n');

  console.log('OUTPUT', output);

  return output;
};
