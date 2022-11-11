export function fetchGitHubUserData(username) {
  const api_endpoint = `https://api.github.com/users/${username}`;

  return fetch(api_endpoint)
    .then(response => response.json())
    .then( ({login, name, public_repos, followers }) => (
    {
      login,
      name,
      public_repos,
      followers
    }
    ) );

}