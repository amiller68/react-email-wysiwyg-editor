import type { ComponentProps } from 'react';
import { Heading, Text, Button, Img, Hr } from '@react-email/components';

// Extract prop types directly from @react-email/components
export type ReactEmailHeadingProps = ComponentProps<typeof Heading>;
export type ReactEmailTextProps = ComponentProps<typeof Text>;
export type ReactEmailButtonProps = ComponentProps<typeof Button>;
export type ReactEmailImgProps = ComponentProps<typeof Img>;
export type ReactEmailHrProps = ComponentProps<typeof Hr>;

// Helper to get style props that are compatible with both preview and email
export type StyleProps = {
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderColor?: string;
  borderWidth?: string;
};
