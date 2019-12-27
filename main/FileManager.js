
import Logger from './Logger'

export default class FileManager {
  static getDirectories(assetId, projects) {
    let formattedPath = FileManager.formatPath(assetId, projects);
    Logger.success(formattedPath);
  }

  static formatPath(assetId, projects) {
    let formatPath = (
      project,
      group,
      name,
      dimension,
      task,
      subtask,
      state,
      version
    ) => `${assetId.path}`;

    let formattedPath = formatPath(
      projects[assetId.project],
      assetId.group,
      assetId.name,
      assetId.dimension,
      assetId.task,
      assetId.subtask,
      assetId.state,
      assetId.version
    );

    return formattedPath;
  }
}
