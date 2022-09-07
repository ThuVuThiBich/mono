/* eslint-disable react/display-name */
import styles from "./styles.module.css";
import { Carousel as AntdCarousel } from "antd";
import { CarouselProps } from "./types";
import clsx from "clsx";
import { CarouselRef } from "antd/lib/carousel";
import { forwardRef, PropsWithChildren } from "react";

const Carousel = forwardRef<CarouselRef, PropsWithChildren<CarouselProps>>(
  (props, ref) => (
    <AntdCarousel
      className={clsx(styles.carousel, props.className)}
      ref={ref}
      {...props}
    >
      {props.children}
    </AntdCarousel>
  )
);

export default Carousel;
