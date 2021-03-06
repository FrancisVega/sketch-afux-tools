import sketch from 'sketch/dom';
import { join } from 'path';
import _ from 'lodash';

export const addLibrary = context => {
  const Library = sketch.Library;
  const libraryFiles = ['AFUX 输出组件.sketch', 'AFUX 交互组件.sketch'];

  const libraries = Library.getLibraries();

  _.forEach(libraries, l => {
    if (_.include(l.name, libraryFiles)) l.remove();
  });

  libraryFiles.forEach(fileName => {
    const libraryUrl = context.plugin.urlForResourceNamed(join('sketch', fileName));
    if (libraryUrl) {
      const libraryPath = String(libraryUrl.path());
      const library = Library.getLibraryForDocumentAtPath(libraryPath);
      AppController.sharedInstance().checkForAssetLibraryUpdates();
      if (context.action === 'Shutdown') library.remove();
    }
  });
};
