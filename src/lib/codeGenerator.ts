import type { EmailComponent } from '../types';

export const generateReactEmailCode = (components: EmailComponent[]): string => {
  let code = `import { Html, Head, Body, Container, Heading, Text, Button, Img, Hr } from '@react-email/components';

export default function Email() {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '20px' }}>
`;

  components.forEach((comp) => {
    switch (comp.type) {
      case 'heading': {
        const props = comp.props as {
          as: string;
          fontSize: string;
          align: string;
          color: string;
          text: string;
        };
        code += `          <Heading as="${props.as}" style={{ fontSize: '${props.fontSize}', textAlign: '${props.align}', color: '${props.color}', margin: '0 0 16px 0' }}>
            ${props.text}
          </Heading>
`;
        break;
      }
      case 'text': {
        const props = comp.props as {
          fontSize: string;
          align: string;
          color: string;
          text: string;
        };
        code += `          <Text style={{ fontSize: '${props.fontSize}', textAlign: '${props.align}', color: '${props.color}', margin: '0 0 16px 0' }}>
            ${props.text}
          </Text>
`;
        break;
      }
      case 'button': {
        const props = comp.props as {
          href: string;
          bgColor: string;
          textColor: string;
          padding: string;
          text: string;
        };
        code += `          <Button
            href="${props.href}"
            style={{
              backgroundColor: '${props.bgColor}',
              color: '${props.textColor}',
              padding: '${props.padding}',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-block',
              textAlign: 'center'
            }}
          >
            ${props.text}
          </Button>
`;
        break;
      }
      case 'image': {
        const props = comp.props as {
          src: string;
          alt: string;
          width: string;
        };
        code += `          <Img
            src="${props.src}"
            alt="${props.alt}"
            width="${props.width}"
            style={{ margin: '0 0 16px 0' }}
          />
`;
        break;
      }
      case 'divider': {
        const props = comp.props as {
          borderColor: string;
          borderWidth: string;
        };
        code += `          <Hr style={{ borderColor: '${props.borderColor}', borderWidth: '${props.borderWidth}', margin: '16px 0' }} />
`;
        break;
      }
    }
  });

  code += `        </Container>
      </Body>
    </Html>
  );
}`;

  return code;
};
