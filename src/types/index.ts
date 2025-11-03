export type ComponentType = 'heading' | 'text' | 'button' | 'image' | 'divider';

export interface HeadingProps {
  text: string;
  as: 'h1' | 'h2' | 'h3' | 'h4';
  align: 'left' | 'center' | 'right';
  color: string;
  fontSize: string;
}

export interface TextProps {
  text: string;
  align: 'left' | 'center' | 'right';
  color: string;
  fontSize: string;
}

export interface ButtonProps {
  text: string;
  href: string;
  bgColor: string;
  textColor: string;
  padding: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  width: string;
}

export interface DividerProps {
  borderColor: string;
  borderWidth: string;
}

export type ComponentProps = HeadingProps | TextProps | ButtonProps | ImageProps | DividerProps;

export interface EmailComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;
}

export interface ValidationError {
  message: string;
  componentIndex: number;
}

export interface ComponentTypeDefinition {
  id: ComponentType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}
