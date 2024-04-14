const REQUIRED_FILE = 'phases.json';

export const validateJson = function (fileName, json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(
      `Malformed JSON in file: ${fileName}, error: ${error.message}`,
    );
  }
};

export const validateFiles = function (fileData) {
  const fileNames = fileData.map((file) => file.fileName);
  throwIfNoFiles(fileNames);
  throwIfNoPhasesFile(fileNames);

  const phasesFile = fileData.find((file) => file.fileName === REQUIRED_FILE);
  const phaseNames = phasesFile.contents.map((phase) =>
    phase.name.toLowerCase(),
  );

  throwIfPhaseIsMissing(phaseNames, fileNames);

  fileData.forEach((file) => {
    const names = file.contents.map((item) => item.name);
    throwIfDuplicateNameFound(file, names);
    throwIfPrerequisitesInvalid(file, names);
    throwIfPrerequisiteNotDefinedAsHighLevelStateOrPhase(file, names);
  });
};

function throwIfNoFiles(fileNames) {
  if (!fileNames || !fileNames.length) {
    throw new Error('No files provided.');
  }
}

function throwIfNoPhasesFile(fileNames) {
  if (!fileNames.includes(REQUIRED_FILE)) {
    throw new Error("A file named 'phases.json' is required.");
  }
}

function throwIfPhaseIsMissing(phaseNames, fileNames) {
  phaseNames.forEach((phaseName) => {
    if (!fileNames.includes(`${phaseName}.json`)) {
      throw new Error(`A file named '${phaseName}.json' is required.`);
    }
  });
}

function throwIfDuplicateNameFound(file, names) {
  const hasDuplicates = new Set(names).size !== names.length;

  if (hasDuplicates) {
    throw new Error(
      `Duplicate phase or stage names are not allowed. Check file: ${file.fileName}`,
    );
  }
}

function throwIfPrerequisitesInvalid(file) {
  if (
    !file.contents.every(
      (item) =>
        Array.isArray(item.prerequisites) &&
        item.prerequisites.every((prereq) => typeof prereq === 'string'),
    )
  ) {
    throw new Error(
      `Prerequisites must be defined and must be an array of strings. Check file: ${file.fileName}`,
    );
  }
}

function throwIfPrerequisiteNotDefinedAsHighLevelStateOrPhase(file, names) {
  file.contents.forEach((item) => {
    item.prerequisites.forEach((prereq) => {
      if (!names.includes(prereq)) {
        throw new Error(
          `A listed prerequisite is not included as a high-level stage/phase. Check file: ${file.fileName}`,
        );
      }
    });
  });
}
