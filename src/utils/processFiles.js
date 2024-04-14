export const topologicalSort = function (name, adjacencyMap) {
  const timestamp = 0;
  const visited = new Set();
  const departures = new Map();
  const result = [];

  function dfs(node) {
    visited.add(node);

    for (const neighbor of adjacencyMap.get(node) || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      } else if (!departures.has(neighbor)) {
        // If the DFS encounters a node that has been visited but not yet marked as departed,
        // it means that there's a cycle in the graph. This is because we've returned to a node before
        // we've finished visiting all its descendants, which is only possible if the graph contains a cycle.
        throw new Error('Cycle found');
      }
    }
    result.push(node);
    departures.set(node, timestamp + 1);
  }

  for (const node of [...adjacencyMap.keys()]) {
    if (!visited.has(node)) {
      try {
        dfs(node);
      } catch (error) {
        throw new Error(`Circular dependency found in ${name}`);
      }
    }
  }

  return result;
};

export const processFiles = function (files) {
  if (!files || !files.length) {
    return [];
  }

  const fileContentsMap = new Map();
  const fileDisplayNameToFileNameMap = new Map();
  files.forEach((file) => {
    fileContentsMap.set(file.displayName, file.contents);
    fileDisplayNameToFileNameMap.set(file.displayName, file.fileName);
  });

  // Create an adjacency map for phases to model it as a graph. Nodes will be phase names and edges will be prerequisites.
  const phaseAdjacencyMap = new Map();

  fileContentsMap
    .get('Phases')
    .forEach((phase) => phaseAdjacencyMap.set(phase.name, phase.prerequisites));

  const orderedPhases = topologicalSort('phases.json', phaseAdjacencyMap);

  const stageAdjacencyMaps = new Map();
  [...fileContentsMap.keys()].forEach((stageName) => {
    if (stageName !== 'Phases') {
      const stageAdjacencyMap = new Map();
      fileContentsMap
        .get(stageName)
        .forEach((stage) =>
          stageAdjacencyMap.set(stage.name, stage.prerequisites),
        );

      stageAdjacencyMaps.set(stageName, stageAdjacencyMap);
    }
  });

  const orderedStages = new Map();
  [...stageAdjacencyMaps.keys()].forEach((phaseName) => {
    const orderedStage = topologicalSort(
      fileDisplayNameToFileNameMap.get(phaseName),
      stageAdjacencyMaps.get(phaseName),
    );
    orderedStages.set(phaseName, orderedStage);
  });

  // Combine ordered phases and stages with their respective numbers in the project lifecycle
  const output = orderedPhases
    .map(
      (phase, i) =>
        `${i + 1} ${phase}\n${orderedStages
          .get(phase)
          .map((stage, j) => `${i + 1}.${j + 1} ${stage}`)
          .join('\n')}`,
    )
    .join('\n');

  return output;
};
