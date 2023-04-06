import { App } from './app/main'
import "./scss/main.scss"

function importAssetGroup(r: any) {
  let images: { [key: string]: any } = {};
  r.keys().map((item: any, index: any) => {
    images[item.replace('./', '')] = r(item);
  })
  return images;
}

const images = importAssetGroup(require.context('./assets', false, /\.(eot|svg|png|jpg|gif|ico)$/i));

const app = App.getInstance();
