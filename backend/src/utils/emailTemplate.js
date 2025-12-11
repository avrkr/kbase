const getEmailTemplate = (title, content, dataItems = [], footerText = '') => {
  let mainContent = content;

  // If dataItems are provided, we assume 'content' is just the intro text, 
  // and we need to build the info box.
  if (dataItems && dataItems.length > 0) {
    mainContent = `<p>${content}</p>`;
    
    mainContent += `<div class="info-box">`;
    dataItems.forEach(item => {
      mainContent += `
        <div class="label">${item.label}</div>
        <div class="value">${item.value}</div>
        <br>
      `;
    });
    mainContent += `</div>`;

    if (footerText) {
      mainContent += `<p>${footerText}</p>`;
    }
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #334155;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
          padding: 32px;
          text-align: center;
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
          text-decoration: none;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 40px 32px;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 24px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
        }
        h1 {
          color: #1e293b;
          font-size: 24px;
          margin-bottom: 24px;
          font-weight: 700;
        }
        p {
          margin-bottom: 16px;
        }
        .button {
          display: inline-block;
          background-color: #4f46e5;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 24px;
        }
        .info-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin: 24px 0;
        }
        .label {
          font-size: 12px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .value {
          font-family: monospace;
          font-size: 16px;
          color: #1e293b;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">kbase</div>
        </div>
        <div class="content">
          <h1>${title}</h1>
          ${mainContent}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} kbase. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = getEmailTemplate;
