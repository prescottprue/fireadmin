import MigrationTemplates from 'routes/MigrationTemplates'

describe('(Route) MigrationTemplates', () => {
  let _route
  // let _component
  // let _childRoutes

  beforeEach(() => {
    _route = MigrationTemplates()
    // _component = _route.getComponent()
    // _childRoutes = _route.getChildRoutes()
  })

  it('Should return a route configuration object', () => {
    expect(MigrationTemplates).to.be.a.function
  })

  it('Sets Path to /migrationTemplates', () => {
    expect(_route.path).to.equal('/migrationTemplates')
  })
  it('Defines a getComponent function', () => {
    expect(_route.getComponent).to.be.a.function
  })
  it('Defines a getChildRoutes function', () => {
    expect(_route.getChildRoutes).to.be.a.function
  })
})
