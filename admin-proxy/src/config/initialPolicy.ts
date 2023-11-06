export const initialPolicy = [
  {
    "endpoint": "*",
    "DELETE": [
      "Owner"
    ],
    "POST": [
      "Owner"
    ],
    "PUT": [
      "Owner"
    ],
    "GET": [
      "Owner"
    ]
  },
  {
    "endpoint": "/policy/permissions",
    "DELETE": [],
    "POST": [],
    "PUT": [],
    "GET": []
  },
  {
    "endpoint": "/auth",
    "DELETE": [],
    "POST": [],
    "PUT": [],
    "GET": []
  },
  {
    "endpoint": "/policy",
    "DELETE": [
        "Owner"
    ],
    "POST": [
        "Owner"
    ],
    "PUT": [
        "Owner"
    ],
    "GET": [
        "Owner",
        "Engineer",
        "Product Manager",
        "Manager"
    ]
  },
  {
    "endpoint": "/api/user",
    "DELETE": [
      "Owner",
    ],
    "POST": [
      "Owner",
      "Manager"
    ],
    "PUT": [
      "Owner",
      "Manager"
    ],
    "GET": [
      "Owner",
      "Engineer",
      "Product Manager",
      "Manager"
    ]
  },
  {
    "endpoint": "/api/point",
    "DELETE": [
      "Owner", //None
    ],
    "POST": [
      "Owner", //None
    ],
    "PUT": [
      "Owner",
      "Manager"
    ],
    "GET": [
      "Owner",
      "Engineer",
      "Product Manager",
      "Manager"
    ]
  },
  {
    "endpoint": "/api/maker-checker",
    "DELETE": [
      "Owner", //None
    ],
    "POST": [
      "Owner",
      "Engineer",
      "Product Manager",
      "Manager"
    ],
    "PUT": [
      "Owner",
      "Engineer",
      "Product Manager",
      "Manager"
    ],
    "GET": [
      "Owner",
      "Engineer",
      "Product Manager",
      "Manager"
    ]
  },
  {
    "endpoint": "/api/logging",
    "DELETE": [
      "None"
    ],
    "POST": [
      "None"
    ],
    "PUT": [
      "None"
    ],
    "GET": [
      "Owner",
      "Engineer",
      "Manager"
    ]
  },
  {
    "endpoint": "/api/user/User/getAllUsers?isAdmin=True",
    "DELETE": [
      "None",
    ],
    "POST": [
      "None"
    ],
    "PUT": [
      "None"
    ],
    "GET": [
      "Owner",
      "Engineer",
      "Manager"
    ]
  },
]
