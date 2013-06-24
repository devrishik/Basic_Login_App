module.exports = 
  { development:
    { 	driver:   'mysql',
	    host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'budget_dev'
    }
  , test:
    {	driver:   'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'budget_test'
    }
  , production:
    { 	driver:   'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'budget_production'
    }
  };
