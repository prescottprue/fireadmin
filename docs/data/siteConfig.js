module.exports = {
  siteTitle: 'fireadmin-docs',
  siteDescription: 'Fireadmin documentation.',
  authorName: 'Prescott Prue',
  authorAvatar: '/images/avatar.png',
  authorDescription:
    'Mechanical/Aerospace engineer turned fullstack javascript developer. Author of react-redux-firebase, redux-firestore and other tools.',
  siteUrl: 'https://github.com/prescottprue/fireadmin',
  // Prefixes all links. For cases when deployed to maxpou.fr/gatsby-starter-morning-dew/
  pathPrefix: '/reside-docs', // Note: it must *not* have a trailing slash.
  siteCover: '/images/cover.jpg',
  googleAnalyticsId: '',
  background_color: '#ffffff',
  theme_color: '#23819E',
  icon: 'src/assets/FireadminLogo.png',
  headerLinks: [
    {
      label: 'Fireadmin Docs',
      url: '/'
    },
    {
      label: 'Patterns',
      url: '/patterns'
    },
    {
      label: 'Testing',
      url: '/testing'
    }
  ],
  // Footer information (ex: Github, Netlify...)
  websiteHost: {
    name: 'GitHub',
    url: 'https://github.com'
  },
  footerLinks: [
    [
      'Explore',
      {
        label: 'Patterns',
        url: '/patterns'
      }
    ],
    [
      'Follow the author',
      {
        label: 'Github',
        url: 'https://github.com/prescottprue/fireadmin',
        iconClassName: 'fa fa-github'
      }
    ]
  ]
}
