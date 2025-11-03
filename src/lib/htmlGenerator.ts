import type { EmailComponent } from '../types';

export const generateHTML = (components: EmailComponent[]): string => {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email Template</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f6f9fc;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; max-width: 600px;">
          <tr>
            <td style="padding: 40px 30px;">
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
        html += `              <${props.as} style="font-size: ${props.fontSize}; text-align: ${props.align}; color: ${props.color}; margin: 0 0 16px 0; font-weight: bold; line-height: 1.3;">
                ${props.text}
              </${props.as}>
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
        html += `              <p style="font-size: ${props.fontSize}; text-align: ${props.align}; color: ${props.color}; margin: 0 0 16px 0; line-height: 1.6;">
                ${props.text}
              </p>
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
        html += `              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${props.href}" style="background-color: ${props.bgColor}; color: ${props.textColor}; padding: ${props.padding}; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: 600;">
                      ${props.text}
                    </a>
                  </td>
                </tr>
              </table>
`;
        break;
      }
      case 'image': {
        const props = comp.props as {
          src: string;
          alt: string;
          width: string;
        };
        html += `              <img src="${props.src}" alt="${props.alt}" width="${props.width}" style="max-width: 100%; height: auto; display: block; margin: 0 0 16px 0; border: 0;" />
`;
        break;
      }
      case 'divider': {
        const props = comp.props as {
          borderColor: string;
          borderWidth: string;
        };
        html += `              <hr style="border: none; border-top: ${props.borderWidth} solid ${props.borderColor}; margin: 16px 0;" />
`;
        break;
      }
    }
  });

  html += `            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return html;
};
