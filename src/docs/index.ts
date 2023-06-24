import baseInfo from './baseInfo';
import components from './components';
import paths from './paths';
import servers from './servers';
import tags from './tags';

export default {
  ...baseInfo,
  ...servers,
  ...components,
  ...paths,
  ...tags,
};
