declare module "react-responsive-masonry" {
  import * as React from "react";

  export interface MasonryProps {
    children: React.ReactNode;
    gutter?: string;
  }

  export interface ResponsiveMasonryProps {
    children: React.ReactNode;
    columnsCountBreakPoints?: { [key: number]: number };
  }

  export const Masonry: React.FC<MasonryProps>;
  export const ResponsiveMasonry: React.FC<ResponsiveMasonryProps>;
}
