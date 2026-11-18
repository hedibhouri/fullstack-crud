import 'vue-router';

export {};

declare module 'vue-router' {
  interface RouteMeta {
    /** Used to build `document.title` */
    title?: string;
  }
}
