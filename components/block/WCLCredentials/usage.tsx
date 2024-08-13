export default function WCLCredentialsUsage() {
  return (
    <div>
      <p>
        To avoid hitting my own rate limits, I'm asking for your ClientID and
        ClientSecret. Don't worry, these credentials are stored securely in your
        browser, and I don't have access to them (I'm generating a token to
        communicate with Warcraft Logs directly from the browser).
        <br />
        <br />
        To generate your credentials, log into your Warcraft Logs account, visit{' '}
        <a href="https://www.warcraftlogs.com/api/clients/" target="_blank">
          this link
        </a>
        , create a new client, and then copy and paste your ClientID and
        ClientSecret into my website.
      </p>
    </div>
  );
}
