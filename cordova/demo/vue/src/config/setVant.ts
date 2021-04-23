import type { App } from "vue";
import {
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Image as VanImage,
  NavBar,
  Tab,
  Tabs,
  Toast,
  Cell,
  CellGroup,
  Image,
  Col,
  Row,
  Grid,
  GridItem,
  Icon,
  Sidebar,
  SidebarItem,
  Card,
  Tag,
  List,
  Sticky,
  Button,
  TreeSelect,
  Progress,
  Popup
} from "vant";

export function setVant(app: App<Element>) {
  app
    .use(Toast)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Swipe)
    .use(SwipeItem)
    .use(VanImage)
    .use(NavBar)
    .use(Tab)
    .use(Tabs)
    .use(Cell)
    .use(CellGroup)
    .use(Image)
    .use(Col)
    .use(Row)
    .use(Grid)
    .use(GridItem)
    .use(Icon)
    .use(Sidebar)
    .use(SidebarItem)
    .use(Card)
    .use(Tag)
    .use(List)
    .use(Sticky)
    .use(Button)
    .use(TreeSelect)
    .use(Popup)
    .use(Progress);
}
