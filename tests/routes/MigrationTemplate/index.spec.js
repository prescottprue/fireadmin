import MigrationTemplate from 'routes/MigrationTemplate'

describe('(Route) MigrationTemplate', () => {
  let _route
  // let _component
  // let _childRoutes

  beforeEach(() => {
    _route = MigrationTemplate()
    // _component = _route.getComponent()
    // _childRoutes = _route.getChildRoutes()
  })

  it('Should return a route configuration object', () => {
    expect(MigrationTemplate).to.be.a.function
  })

  it('Sets Path to /migrationTemplate', () => {
    expect(_route.path).to.equal('/migrationTemplate')
  })
  it('Defines a getComponent function', () => {
    expect(_route.getComponent).to.be.a.function
  })
  it('Defines a getChildRoutes function', () => {
    expect(_route.getChildRoutes).to.be.a.function
  })
})
