export default {
    'companyCompensations':[
        {
            'id': 1001,
            'order': 1,
            'name': 'Salary',
            'type': {
                'label': 'Salary',
                'value': 'SALARY',
            },
            'assignable': true,
            'formula': 'Standard-Salary',
            'start_date': null,
            'end_date': null
        },{
            'id': 1002,
            'order': 2,
            'name': 'Meal allowance',
            'type': {
                'label': 'Regular Allowance',
                'value': 'REGULAR_ALLOWANCE',
            },
            'assignable': true,
            'formula': 'Standard-Meal',
            'start_date': null,
            'end_date': null
        },{
            'id': 1003,
            'order': 3,
            'name': 'Overtime',
            'type': {
                'label': 'Overtime',
                'value': 'OVERTIME',
            },
            'assignable': false,
            'formula': 'Standard-Overtime',
            'start_date': null,
            'end_date': null
        },{
            'id': 1004,
            'order': 4,
            'name': '13th month',
            'type': {
                'label': 'Benefit',
                'value': 'BENEFIT',
            },
            'assignable': false,
            'formula': 'Standard-13thMonth',
            'start_date': 'Nov 02 of last year',
            'end_date': 'Nov 01 of current year'
        },
    ],
    'formulas': {
        'companyCompensations:': [
            'Standard-Salary',
            'Standard-Overtime',
            'Standard-Meal',
            'Standard-13thMonth',
        ]
    },
    'leftToRightItems': [
        {
            "image":{
                "path": "/images/product/202306201506003693.webp"
            },
            "listIcon": "octicon:circuit-board",
            "title": "Segotep Memphis-S Meow PC Case (M-ATX / ITX supported)",
            "description": "Designed in collaboration with Segotep, the MEOW Series chassis is a micro-ATX tower featuring panel art inspired by Bobi the orange tabby cat. The chassis features a semi-mesh front and side panels to allow airflow and improve cooling. The tempered glass side panel provides a clear view of the interior and the rest of the MEOW ORANGE Series components.",
            "bullets": {
                "value": [
                    "COLORFIRE Series",
                    "Supports mini-ITX and micro-ATX motherboards",
                    "Up to three 2.5\" SSDs and one 3.5\" HDD",
                    "Up to 240mm radiators of AIO liquid coolers Supports up to 170mm tall CPU coolers",
                    "Up to six 120mm case fans"
                ]
            },
            "link": "/prototype",
            "frameBorder": "#e3b98f"
        },
        {
            "image":{
                "path": "/images/product/c76383ac-e6c0-4725-bec0-b171449c5960.webp"
            },
            "listIcon": "octicon:circuit-board",
            "title": "COLORFIRE B760M-MEOW WIFI D5 ORANGE",
            "description": "COLORFUL introduces the CVN B760M FROZEN WIFI D5 and CVN B760I FROZEN WIFI motherboards for gamers and enthusiasts.",
            "bullets": {
                "value": [
                    "COLORFIRE Series",
                    "Support the 14th/13th and 12th generation Intel adapting to the LGA 1700 slot of the motherboard ® Core TM, Pentium ® And Cylon ® processor",
                    "Support dual channel DDR5-7200 (OC) MHz memory",
                    "Provide 3 PCIe 4.0 x4 M.2 SSD slots",
                    "Provide one USB 3.2 Gen 2 Type-C and two USB 3.2 Gen 1 Type-A high-speed rear interfaces"
                ]
            },
            "link": "/prototype",
            "frameBorder": "#e3b98f"
        },
        {
            "image":{
                "path": "/images/product/fc44dd4e-40ed-49df-bd9e-bc210dfbaf7c.webp"
            },
            "listIcon": "bi:gpu-card",
            "title": "COLORFIRE GeForce RTX 4060 MEOW-ORG 8GB-V",
            "description": "",
            "bullets": {
                "value": [
                    "COLORFIRE Series",
                    'Efficient and durable heat dissipation.',
                    'Adjustable lighting effects via iGame Center.'
                ]
            },
            "link": "/prototype",
            "frameBorder": "#e3b98f"
        }
    ],
    'topToBottomItems': [
        {
            'theme': 'dark',
            'image':{
                'path': '/images/spotlight/1697501586302.jpg'
            },
            'listIcon': 'octicon:circuit-board',
            'title': 'New Z790 motherboards from ROG pave the way for 14th Gen Intel Core CPUs',
            'link': '/prototype',
            'description': 'WiFi 7 support, more fast storage, front-panel device charging, intelligent controls — our latest Z790 motherboards have it all.',
            'frameBorder': '#a8dadc',
            'contentBorder': '#4b6e7a'
        },
        {
            'theme': 'dark',
            'image':{
                'path': '/images/spotlight/w636.jpg'
            },
            'listIcon': 'octicon:circuit-board',
            'title': 'ASUS B550 Series- Rise Above the Battlefield',
            'link': '/prototype',
            'description': 'ASUS B550 Series packs all the essentials for the latest AMD processors. WiFi 6 and 2.5 Gb Ethernet provide ample bandwidth for online gaming, while AI Noise-Canceling Mic software ensures you’re clearly heard in-game. And system set up is a breeze with the intuitive BIOS Flashback™.',
            'frameBorderPrimary': '#dea87e',
            'frameBorderSecondary': 'rgba(180,139,88,0.64)'
        },
        {
            'theme': 'dark',
            'image':{
                'path': '/images/spotlight/w637.jpg'
            },
            'listIcon': 'octicon:circuit-board',
            'title': 'ASUS Z490 Series- AI Motherboards',
            'link': '/prototype',
            'description': 'ASUS Z490 motherboards feature intelligent overclocking, revolutionary cooling, a robust power solution, optimized memory and next-gen connectivity to unleash the power of the latest 10th Gen Intel® Core™ processors.',
            'frameBorderPrimary': '#a8dadc',
            'frameBorderSecondary': '#4b6e7a'
        },
        {
            'theme': 'dark',
            'image':{
                'path': '/images/spotlight/1692323352671.webp'
            },
            'listIcon': 'octicon:circuit-board',
            'title': 'Race after your dreams with the power of the ROG Strix SCAR 16 and SCAR 18',
            'link': '/prototype',
            'description': 'Discover the amazing true story of a gamer turned pro racer in the new movie Gran Turismo.',
            'frameBorderPrimary': '#908686',
            'frameBorderSecondary': '#7b6969'
        },
        {
            'theme': 'dark',
            'image':{
                'path': '/images/spotlight/c869bdd2-4aa7-408d-b2af-75681836aa9a.webp'
            },
            'listIcon': 'octicon:circuit-board',
            'title': 'COLORFUL Launches EVOL P15 Gaming Laptop',
            'link': '/prototype',
            'description': null,
            'bullets': {
                'column': 2,
                'value': [
                    'Retro-Futuristic Design',
                    'Deep Chiller System',
                ]
            },
            'frameBorderPrimary': '#a8dadc',
            'frameBorderSecondary': '#4b6e7a'
        },
        {
            'theme': 'dark',
            'image':{
                'path': '/images/spotlight/5037c274-2024-46d3-8f04-e70ccea4ec8f.webp'
            },
            'listIcon': 'bi:gpu-card',
            'title': 'COLORFUL Introduces GeForce RTX 4070 Series Graphics Card Lineup',
            'link': '/prototype',
            'description': '',
            'bullets': {
                'value': [
                    'iGame GeForce RTX 4070 Vulcan OC',
                    'COLORFUL iGame GeForce RTX 4070 Neptune OC',
                    'COLORFUL iGame GeForce RTX 4070 Advanced OC',
                    'COLORFUL iGame GeForce RTX 4070 Ultra W',
                    'COLORFUL GeForce RTX 4070 NB EX'
                ]
            },
            'frameBorderPrimary': '#9b888c',
            'frameBorderSecondary': '#C2446F'
        },
        {
            'theme': 'dark',
            'image':{
                'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-009.jpg'
            },
            'listIcon': 'octicon:circuit-board',
            'title': 'FOOL\'S GOLD',
            'link': '/prototype',
            'description': 'Season 4 — Fool’s Gold launches on Call of Duty: Mobile on April 17 at 5 PM PT.',
            'frameBorderPrimary': '#3b6b2a',
            'frameBorderSecondary': '#284d1c'
        },
        {
            'theme': 'dark',
            'image':{
                'path': '/images/spotlight/w638.jpg'
            },
            'listIcon': 'octicon:circuit-board',
            'title': 'ROG Gaming Audio',
            'link': '/prototype',
            'description': 'Utilizing advanced trace layout techniques to mitigate noise, and featuring carefully selected components and a host of software options that enhance the gaming experience, ROG Gaming Audio pushes onboard audio to the very limits.',
            'frameBorderPrimary': '#908686',
            'frameBorderSecondary': '#7b6969'
        },
    ],
    'prototype': {
        'genderGroup': {
            selection: [
                {text : 'Male', value: 0},
                {text : 'Female', value: 1},
            ],
            selected: 1
        },
        'category': {
            search: '',
            data: [
                {text : 'Charms', value: 0},
                {text : 'Bracelets', value: 1},
                {text : 'Tab\t\tBrooches\nand\nPins', value: 2},
                {text : 'Necklaces', value: 3},
                {text : 'Earrings', value: 4},
                {text : 'Rings', value: 5},
                {text : 'Polyester', value: 6},
            ],
            selection: [
                {text : 'Charms', value: 0},
                {text : 'Bracelets', value: 1},
                {text : 'Tab\t\tBrooches\nand\nPins', value: 2},
                {text : 'Necklaces', value: 3},
                {text : 'Earrings', value: 4},
                {text : 'Rings', value: 5},
                {text : 'Polyester', value: 6},
            ],
            selected: []
        },
        'plan': {
            search: '',
            data: [
                {text : 'Free', value: 0},
                {text : 'Individual', value: 1},
                {text : 'Standard Corporate', value: 2},
                {text : 'Custom Corporate', value: 3},
                {text : 'Evaluator', value: 4},
            ],
            selection: [
                {text : 'Free', value: 0},
                {text : 'Individual', value: 1},
                {text : 'Standard Corporate', value: 2},
                {text : 'Custom Corporate', value: 3},
                {text : 'Evaluator', value: 4},
            ],
            selected: '3'
        },
        'categoryGroup': {
            selection: [
                {text : 'Charms', value: 0},
                {text : 'Bracelets', value: 1},
                {text : 'Tab\t\tBrooches\nand\nPins', value: 2},
                {text : 'Necklaces', value: 3},
                {text : 'Earrings', value: 4},
                {text : 'Rings', value: 5},
                {text : 'Polyester', value: 6},
            ],
            selected: 3
        },
        'perPage': {
            search: '',
            data: [
                {text : '10 per page', value: 10},
                {text : '25 per page', value: 25},
                {text : '100 per page', value: 100},
            ],
            selection: [
                {text : '10 per page', value: 10},
                {text : '25 per page', value: 25},
                {text : '100 per page', value: 100},
            ],
            selected: 10
        },
        'bookingType': {
            search: '',
            data: [
                {text : 'Individual', value: 1},
                {text : 'Spouse/Co-Owner', value: 2},
                {text : 'Corporation/Partnership', value: 3}
            ],
            selection: [
                {text : 'Individual', value: 1},
                {text : 'Spouse/Co-Owner', value: 2},
                {text : 'Corporation/Partnership', value: 3}
            ],
            selected: 1
        },
        'multiSelectPrototypePayload': {
            fetch: {
                url: '/api/selections/prototype',
                filters: {
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            },
            selected: [1,2]
        },
        'singleSelectPrototype': {
            search: '',
            data: [
                {text : 'PRT3221289642 005-5RZX3-MPJ-9GRRWA', value: 0},
                {text : 'PRT3224439642 005-5RZX3-MPJ-9GRRWA', value: 1},
                {text : 'PRT3222219642 005-5RZX3-MPJ-9GRRWA', value: 2},
                {text : 'PRT3224324642 005-5RZX3-MPJ-9GRRWA', value: 3},
                {text : 'PRT3221285552 005-5RZX3-MPJ-9GRRWA', value: 4},
            ],
            selection: [
                {text : 'PRT3221289642 005-5RZX3-MPJ-9GRRWA', value: 0},
                {text : 'PRT3224439642 005-5RZX3-MPJ-9GRRWA', value: 1},
                {text : 'PRT3222219642 005-5RZX3-MPJ-9GRRWA', value: 2},
                {text : 'PRT3224324642 005-5RZX3-MPJ-9GRRWA', value: 3},
                {text : 'PRT3221285552 005-5RZX3-MPJ-9GRRWA', value: 4},
            ],
            selected: null
        },
        'singleSelectPrototypePayload': {
            fetch: {
                url: '/api/selections/prototype',
                filters: {
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            },
            selected: 1,
        },
        'categorySelection': [
            {text : 'Charms', value: true},
            {text : 'Bracelets', value: true},
            {text : 'Tab\t\tBrooches\nand\nPins', value: false},
            {text : 'Necklaces', value: true},
            {text : 'Earrings', value: false},
            {text : 'Rings', value: true},
            {text : 'Polyester', value: true},
        ],
        'statusGroup': {
            selection: [
                {text : 'For Approval', value: 0},
                {text : 'Approved', value: 1},
                {text : 'Tab\t\tProcessing\nNew Line\nNew Line', value: 2},
                {text : 'Rejected', value: 3},
                {text : 'Complete', value: 4},
            ],
            selected: 3
        },
        'transactionGroup': {

            selection: [
                {text : 'Cash', value: 0},
                {text : 'Pre Paid', value: 1},
                {text : 'Tab\t\tPost\nPaid', value: 2},
                {text : 'Card', value: 3},
                {text : 'Debit', value: 4},
            ],
            selected: 3
        },
        'accordionSingleExpand': {
            recentActive: 2,
            options: [
                {
                    title: 'Check box',
                    body: {
                        type: 'checkbox',
                        value: [
                            {text : 'Charms', value: true},
                            {text : 'Bracelets', value: true},
                            {text : 'Tab\t\tBrooches\nand\nPins', value: false},
                            {text : 'Necklaces', value: true},
                            {text : 'Earrings', value: false},
                            {text : 'Rings', value: true},
                            {text : 'Polyester', value: true},
                        ]
                    },
                    active: false
                },
                {
                    title: 'Radio box',
                    body: {
                        type: 'radio',
                        value: {
                            selection: [
                                {text : 'Cash', value: 0},
                                {text : 'Pre Paid', value: 1},
                                {text : 'Tab\t\tPost\nPaid', value: 2},
                                {text : 'Card', value: 3},
                                {text : 'Debit', value: 4},
                            ],
                            selected: 3
                        }
                    },
                    active: false
                },
                {
                    title: 'Coldiron Armor Set, Coldiron Armor Set, Coldiron Armor Set, Coldiron Armor Set',
                    body: {
                        type: 'text',
                        value: 'This armor was forged for the sole purpose of resisting the malignance spreading across the land.'
                    },
                    active: true
                },
                {
                    title: 'Coldiron Barding Mount Armor',
                    body: {
                        type: 'text',
                        value: 'Adorn your new steeds with mount armor inspired by the malignance taking over Sanctuary.'
                    },
                    active: false
                },
                {
                    title: 'Weapon skins, Mount Trophies, Emotes, Platinum, and more',
                    body: {
                        type: 'text',
                        value: 'Explore a range of cosmetics to earn along the Premium Battle Pass. Collect a weapon transmog for all 19 weapon types. 2 emotes for each class let you threaten your enemies or find a little time to play around with malignant heart cages. 2 headstones even let you die in style. Adorn your horse with 5 new mount trophies.'
                    },
                    active: false
                },
                {
                    title: '“On the Warpath” Emote – Accelerated Battle Pass',
                    body: {
                        type: 'text',
                        value: 'Show everyone you’re ready for battle when you slam your banner down, signaling to enemies that you’re ready for a fight. This emote is only included in the Accelerated Battle Pass.'
                    },
                    active: false
                }
            ]
        },
        'accordionMultiExpand': {
            recentActive: 2,
            options: [
                {
                    title: 'Check box',
                    body: {
                        type: 'checkbox',
                        value: [
                            {text : 'Charms', value: true},
                            {text : 'Bracelets', value: true},
                            {text : 'Tab\t\tBrooches\nand\nPins', value: false},
                            {text : 'Necklaces', value: true},
                            {text : 'Earrings', value: false},
                            {text : 'Rings', value: true},
                            {text : 'Polyester', value: true},
                        ]
                    },
                    active: false
                },
                {
                    title: 'Radio box',
                    body: {
                        type: 'radio',
                        value: {
                            selection: [
                                {text : 'Cash', value: 0},
                                {text : 'Pre Paid', value: 1},
                                {text : 'Tab\t\tPost\nPaid', value: 2},
                                {text : 'Card', value: 3},
                                {text : 'Debit', value: 4},
                            ],
                            selected: 3
                        }
                    },
                    active: false
                },
                {
                    title: 'Coldiron Armor Set, Coldiron Armor Set, Coldiron Armor Set, Coldiron Armor Set',
                    body: {
                        type: 'text',
                        value: 'This armor was forged for the sole purpose of resisting the malignance spreading across the land.'
                    },
                    active: true
                },
                {
                    title: 'Coldiron Barding Mount Armor',
                    body: {
                        type: 'text',
                        value: 'Adorn your new steeds with mount armor inspired by the malignance taking over Sanctuary.'
                    },
                    active: false
                },
                {
                    title: 'Weapon skins, Mount Trophies, Emotes, Platinum, and more',
                    body: {
                        type: 'text',
                        value: 'Explore a range of cosmetics to earn along the Premium Battle Pass. Collect a weapon transmog for all 19 weapon types. 2 emotes for each class let you threaten your enemies or find a little time to play around with malignant heart cages. 2 headstones even let you die in style. Adorn your horse with 5 new mount trophies.'
                    },
                    active: false
                },
                {
                    title: '“On the Warpath” Emote – Accelerated Battle Pass',
                    body: {
                        type: 'text',
                        value: 'Show everyone you’re ready for battle when you slam your banner down, signaling to enemies that you’re ready for a fight. This emote is only included in the Accelerated Battle Pass.'
                    },
                    active: false
                }
            ]
        },
        'dataTables':{
            '1': {
                'selected': [1001,1002, 67],
                'headers': [
                    { text: 'ID', value: 'id'},
                    { text: 'NAME', value: 'name'},
                    { text: 'CATEGORY', alignData: 'right', value: 'category', width: '140px'},
                    { text: 'DATE ADDED', alignData: 'right', value: 'datetime_added', width: '145px'},
                    { text: 'DATE CREATED', alignData: 'right', value: 'created_at'},
                    { text: 'DATE UPDATED', alignData: 'right', value: 'updated_at'},],
                'data': [
                    {
                        "id": 45,
                        "name": "Jamaal Hodkiewicz",
                        "code": "PRT0451171313",
                        "type": 1,
                        "category": null,
                        "capacity": 33,
                        "datetime_added": "2023-08-22 17:44:03",
                        "created_at": "2023-08-22 17:44:03",
                        "updated_at": "2023-08-22 17:44:03"
                    },
                    {
                        "id": 67,
                        "name": "Tracy Ward",
                        "code": "PRT9284750057",
                        "type": 1,
                        "category": 114,
                        "capacity": 23,
                        "datetime_added": "2023-08-22 17:44:03",
                        "created_at": "2023-08-22 17:44:03",
                        "updated_at": "2023-08-22 17:44:03"
                    },
                    {
                        "id": 88,
                        "name": "Amari Gerlach",
                        "code": "PRT9249091497",
                        "type": 5,
                        "category": null,
                        "capacity": 22,
                        "datetime_added": "2023-08-22 17:44:03",
                        "created_at": "2023-08-22 17:44:03",
                        "updated_at": "2023-08-22 17:44:03"
                    },
                ]
            },
            '2': {
                'selected': [1001,1002],
                'headers': [
                    { text: 'ID', value: 'id'},
                    { text: 'NAME', value: 'name'},
                    { text: 'CODE', alignHeader: 'center', value: 'code'},
                    { text: 'DATE ADDED', alignData: 'right', value: 'datetime_added'},
                    { text: 'CATEGORY', alignData: 'right', value: 'category'},
                    { text: 'CAPACITY', alignData: 'left', value: 'capacity'},
                    { text: 'TYPE', value: 'type'}
                ],
                'data': [
                    {
                        "id": 246,
                        "name": "Imani Lang",
                        "code": "PRT3041670860",
                        "type": 4,
                        "category": 89,
                        "capacity": 26,
                        "datetime_added": "2023-08-22 17:44:03",
                        "created_at": "2023-08-22 17:44:03",
                        "updated_at": "2023-08-22 17:44:03"
                    },
                    {
                        "id": 273,
                        "name": "Fae Torp",
                        "code": "PRT9023387510",
                        "type": 1,
                        "category": null,
                        "capacity": 3,
                        "datetime_added": "2023-08-22 17:44:03",
                        "created_at": "2023-08-22 17:44:03",
                        "updated_at": "2023-08-22 17:44:03"
                    },
                    {
                        "id": 384,
                        "name": "Katarina Shanahan",
                        "code": "PRT0920672517",
                        "type": 5,
                        "category": null,
                        "capacity": 8,
                        "datetime_added": "2023-08-22 17:44:03",
                        "created_at": "2023-08-22 17:44:03",
                        "updated_at": "2023-08-22 17:44:03"
                    },
                ]
            },
            '3': {
                'selected': [1001,1002],
                'headers': [
                    { text: '#', value: 'row_number'},
                    { text: 'TOOLS', value: 'tools'},
                    { text: 'ID', value: 'id'},
                    { text: 'NAME', value: 'name', width: '120px'},
                    { text: 'CODE', alignHeader: 'center', value: 'code', width: '100px'},
                    { text: 'SINGLE PAGINATED', value: 'single_paginated', width: '170px'},
                    { text: 'MULTI PAGINATED', value: 'multi_paginated', width: '170px'},
                    { text: 'SINGLE SELECT', value: 'single_select', width: '170px'},
                    { text: 'MULTI SELECT', value: 'multi_select', width: '170px'},
                    { text: 'TYPE', value: 'type'},
                    { text: 'CATEGORY', alignData: 'right', value: 'category'},
                    { text: 'CAPACITY', alignData: 'left', value: 'capacity'},
                    { text: 'DATE ADDED', alignData: 'right', value: 'datetime_added', width: '170px'},
                    { text: 'DATE CREATED', alignData: 'right', value: 'created_at'},
                    { text: 'DATE UPDATED', alignData: 'right', value: 'updated_at'},
                ],
                'data': [
                    {
                        "row_number": '#1',
                        "id": 418,
                        "name": "Imani Lang",
                        "code": "PRT1915550179",
                        "type": 3,
                        "category": null,
                        "capacity": 19,
                        "single_select_prototype_payload": {
                            fetch: {
                                url: '/api/selections/prototype',
                                filters: {
                                    search: {
                                        keyword: '',
                                        callback: 1
                                    }
                                }
                            },
                            selected: null,
                        },
                        "multi_select_prototype_payload": {
                            fetch: {
                                url: '/api/selections/prototype',
                                filters: {
                                    search: {
                                        keyword: '',
                                        callback: 1
                                    }
                                }
                            },
                            selected: []
                        },
                        "datetime_added": "2023-08-22 17:44:03",
                        "created_at": "2023-08-22 17:44:03",
                        "updated_at": "2023-08-22 17:44:03"
                    },
                    {
                        "row_number": '#2',
                        "id": 478,
                        "name": "Fae Torp",
                        "code": "PRT4902978961",
                        "type": 2,
                        "category": 68,
                        "capacity": 15,
                        "single_select_prototype_payload": {
                            fetch: {
                                url: '/api/selections/prototype',
                                filters: {
                                    search: {
                                        keyword: '',
                                        callback: 1
                                    }
                                }
                            },
                            selected: null,
                        },
                        "multi_select_prototype_payload": {
                            fetch: {
                                url: '/api/selections/prototype',
                                filters: {
                                    search: {
                                        keyword: '',
                                        callback: 1
                                    }
                                }
                            },
                            selected: []
                        },
                        "datetime_added": "2023-08-22 17:44:03",
                        "created_at": "2023-08-22 17:44:03",
                        "updated_at": "2023-08-22 17:44:03"
                    },
                    {
                        "row_number": '#3',
                        "id": 552,
                        "name": "Katarina Shanahan",
                        "code": "PRT3932126979",
                        "type": 1,
                        "category": 4,
                        "capacity": 15,
                        "single_select_prototype_payload": {
                            fetch: {
                                url: '/api/selections/prototype',
                                filters: {
                                    search: {
                                        keyword: '',
                                        callback: 1
                                    }
                                }
                            },
                            selected: null,
                        },
                        "multi_select_prototype_payload": {
                            fetch: {
                                url: '/api/selections/prototype',
                                filters: {
                                    search: {
                                        keyword: '',
                                        callback: 1
                                    }
                                }
                            },
                            selected: []
                        },
                        "datetime_added": "2023-08-22 17:44:03",
                        "created_at": "2023-08-22 17:44:03",
                        "updated_at": "2023-08-22 17:44:03"
                    },
                    {
                        "row_number": '#4',
                        "id": 702,
                        "name": "Janice Doe",
                        "code": "PRT2563775044",
                        "type": 5,
                        "category": 79,
                        "capacity": 35,
                        "single_select_prototype_payload": {
                            fetch: {
                                url: '/api/selections/prototype',
                                filters: {
                                    search: {
                                        keyword: '',
                                        callback: 1
                                    }
                                }
                            },
                            selected: null,
                        },
                        "multi_select_prototype_payload": {
                            fetch: {
                                url: '/api/selections/prototype',
                                filters: {
                                    search: {
                                        keyword: '',
                                        callback: 1
                                    }
                                }
                            },
                            selected: []
                        },
                        "datetime_added": "2023-08-22 17:44:03",
                        "created_at": "2023-08-22 17:44:03",
                        "updated_at": "2023-08-22 17:44:03"
                    }
                ]
            },
        }
    },
    'carousel': {
        'newArrivals': [
            {
                'image': '/images/hero/21f0a52e-db0a-4108-9405-44a8a548e534.webp',
                'title': 'MEOW SET',
                'subTitle': 'RTX 4060 Ti MEOW-ORG OC 16GB / B760M-MEOW WIFI D5 ORANGE.',
                'link': '/'
            },
            {
                'image': '/images/hero/ea05cc1d-1384-47f4-84ab-b3c049f7e13e.webp',
                'title': 'AIO PC',
                'subTitle': 'iGame G-ONE Plus i7-12700H/RTX3060.',
                'link': '/'
            },
            {
                'image': '/images/hero/353f5cb4-8113-43fa-b5c4-3a9bf1314474.webp',
                'title': 'Laptop',
                'subTitle': 'Colorful EVOL P15 ',
                'link': '/'
            },
            {
                'image': '/images/hero/667a2407-ae78-4e4d-b69e-059552bca96e.webp',
                'title': 'Graphics Card',
                'subTitle': 'iGame GeForce RTX 4090 Vulcan OC-V',
                'link': '/'
            },
            {
                'image': '/images/hero/a5a3aa00-67ea-4c3e-b6b4-6b9b92a0a50a.webp',
                'title': 'Motherboard',
                'subTitle': 'CVN B760I FROZEN WIFI D5 V20',
                'link': '/'
            },
            {
                'image': '/images/hero/607742af-81ec-4893-b94c-1b49c228fbde.webp',
                'title': 'SSD',
                'subTitle': 'CN700 1TB',
                'link': '/'
            }
        ],
        'featuredItems': [
            {
                'image': '/images/product/f85a85cd-fa65-48d3-9d36-755b4a6acf87.webp',
                'title': 'Graphics Card',
                'subTitle': 'COLORFIRE GeForce RTX 4060 Ti MEOW-ORG 8GB-V',
                'link': '/prototype'
            },
            {
                'image': '/images/product/176a61f6-884b-4def-9c35-5d30cdca686f.webp',
                'title': 'Graphics Card',
                'subTitle': 'iGame GeForce RTX 4080 16GB Ultra W OC-V',
                'link': '/prototype'
            },
            {
                'image': '/images/product/cd8f248a-bd3d-4553-bcf7-849ed27c4b36.webp',
                'title': 'Graphics Card',
                'subTitle': 'iGame GeForce RTX 4070 Ti Ultra W OC-V',
                'link': '/prototype'
            },
            {
                'image': '/images/product/20220923155420669106.webp',
                'title': 'Graphics Card',
                'subTitle': 'iGame GeForce RTX 4090 Vulcan OC-V',
                'link': '/prototype'
            }
        ],
        'trendingItems': [
            {
                'image': '/images/product/50c51e5f-6507-4319-8f95-967d60f0bb3f_transparent.webp',
                'title': 'Graphics card',
                'subTitle': 'iGame GeForce RTX 4080 SUPER Black Myth Wukong Edition OC 16GB-V',
                'link': '/prototype'
            },
            {
                'image': '/images/product/c7dfc1f1-102a-4ea9-84f6-f87dda2094b8.webp',
                'title': 'Motherboard',
                'subTitle': 'CVN Z790D5 GAMING PRO WIFI V20',
                'link': '/prototype'
            },
            {
                'image': '/images/product/38131462-2ae0-443e-8555-9e744c532887.webp',
                'title': 'Motherboard',
                'subTitle': 'BATTLE-AX Z790AK-PLUS D5 V20',
                'link': '/prototype'
            },
            {
                'image': '/images/product/ebac5037-c3d2-4275-b96b-24f855695841.webp',
                'title': 'Motherboard',
                'subTitle': 'iGame Z790D5 ULTRA V20',
                'link': '/prototype'
            },
            {
                'image': '/images/product/f9b5a1a7-d532-4cf8-970c-d812b857a666.webp',
                'title': 'Motherboard',
                'subTitle': 'iGame Z790D5 FLOW V20',
                'link': '/prototype'
            }
        ]
    },
    'faqs': {
        'options': [
            {
                title: 'Coldiron Armor Set',
                body: {
                    type: 'text',
                    value: 'This armor was forged for the sole purpose of resisting the malignance spreading across the land.'
                },
                active: true
            },
            {
                title: 'Coldiron Barding Mount Armor',
                body: {
                    type: 'text',
                    value: 'Adorn your new steeds with mount armor inspired by the malignance taking over Sanctuary.'
                },
                active: false
            },
            {
                title: 'Weapon skins, Mount Trophies, Emotes, Platinum, and more - Weapon skins, Mount Trophies, Emotes, Platinum, and more',
                body: {
                    type: 'text',
                    value: 'Explore a range of cosmetics to earn along the Premium Battle Pass. Collect a weapon transmog for all 19 weapon types. 2 emotes for each class let you threaten your enemies or find a little time to play around with malignant heart cages. 2 headstones even let you die in style. Adorn your horse with 5 new mount trophies.'
                },
                active: false
            },
            {
                title: '“On the Warpath” Emote – Accelerated Battle Pass',
                body: {
                    type: 'text',
                    value: 'Show everyone you’re ready for battle when you slam your banner down, signaling to enemies that you’re ready for a fight. This emote is only included in the Accelerated Battle Pass.'
                },
                active: false
            }
        ]
    },
    'news': [
        {
            'image':{
                'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-009.jpg'
            },
            'title': 'COLORFUL Launches The GeForce RTX 4060 Ti and RTX 4060 Series Graphics Cards Supercharged by DLSS 3',
            'subTitle': 'COLORFUL introduces the CVN B760M FROZEN WIFI D5 and CVN B760I FROZEN WIFI motherboards for gamers and enthusiasts. Coming in a compact micro-ATX and mini-ITX form factors, both motherboards feature PCIe 5.0 x16 slot to support the latest high-end graphics cards. The CVN B760 motherboards also come with Wi-Fi 6, three PCIe 4.0 M.2 slots for the CVN B760M FROZEN WIFI D5 and two PCIe 4.0 M.2 slots for the CVN B760I FROZEN WIFI mini-ITX motherboard. COLORFUL also presents the BATTLE-AX B760M-F PRO motherboard with DDR4 memory support and two PCIe 4.0 M.2 slots.',
        },
        {
            'image':{
                'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-002.jpg'
            },
            'title': 'Seize the Season With RTX',
            'subTitle': 'Celebrate the holiday season with the ultimate upgrade.Treat yourself to unrivaled performance and features with GeForce RTX™ 40 Series graphics cards and laptops built to transform every experience.',
        },
        {
            'image':{
                'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-TOUT.jpg'
            },
            'title': 'COLORFUL Launches B760 Series Motherboards',
            'subTitle': 'COLORFUL introduces the CVN B760M FROZEN WIFI D5 and CVN B760I FROZEN WIFI motherboards for gamers and enthusiasts. Coming in a compact micro-ATX and mini-ITX form factors, both motherboards feature PCIe 5.0 x16 slot to support the latest high-end graphics cards. The CVN B760 motherboards also come with Wi-Fi 6, three PCIe 4.0 M.2 slots for the CVN B760M FROZEN WIFI D5 and two PCIe 4.0 M.2 slots for the CVN B760I FROZEN WIFI mini-ITX motherboard. COLORFUL also presents the BATTLE-AX B760M-F PRO motherboard with DDR4 memory support and two PCIe 4.0 M.2 slots.',
        },
        {
            'image':{
                'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-003.jpg'
            },
            'title': 'Further With AI, Faster on RTX',
            'subTitle': 'From enhanced creativity + ultra-efficient productivity to blisteringly fast gaming. The ultimate in AI power on Windows PCs is on NVIDIA RTX and GeForce RTX.',
        },
        {
            'image':{
                'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-001.jpg'
            },
            'title': 'PC Game Pass Game Bundle',
            'subTitle': 'Get PC Game Pass for 3 months with select GeForce RTX 40 Series*',
        },
        {
            'image':{
                'path': '/images/spotlight/CODM-S4-FOOLS-GOLD-008.jpg'
            },
            'title': 'COLORFUL Launches EVOL X15 AT Gaming Laptop Powered by Intel 13th Gen CPUs and NVIDIA GeForce RTX 4060 GPU and NVIDIA GeForce RTX 4060 GPU and NVIDIA GeForce RTX 4060 GPU',
            'subTitle': 'The EVOL X15 AT sports a 15.6” QHD (2560x1440) 165Hz display with NVIDIA G-SYNC support for stutter-free and tear-free gaming experience. Aside from Pine Blue and Mist Grey, the new EVOL X15 AT gaming laptop comes in the new Purple Grape color.',
        },
    ],
    'featured': [
        // {
        //     'id': 'feature_1',
        //     'type': 'full',
        //     'theme': 'dark',
        //     'proximity': '40',
        //     'title': 'Spotlight',
        //     'debug': {
        //         'bg': 'rgba(255,0,0,0.2)',
        //     },
        //     'background': '#ffffff',
        //     'layer': {
        //         'type': 'image',
        //         'source': ''
        //     },
        //     'media': {
        //         'type': 'image',
        //         //'source': '/images/product/05/kv-bg.webp'
        //     },
        //     'overview_enabled': false,
        //     'overview_height': {
        //         'sm': '200px',
        //         'md': '200px',
        //         'lg': '200px',
        //         'xl': '200px'
        //     },
        //     'overview_min_height': 200,
        //     'card_dimension': {
        //         'sm': ['calc(50% - 0.5rem)', '240px'],
        //         'md': ['calc(50% - 0.5rem)', '300px'],
        //         'lg': ['calc(50% - 0.5rem)', '320px'],
        //         'xl': ['calc(50% - 0.5rem)', '400px'],
        //         'minimum': ['840px', '240px'],
        //     },
        //     'children': [
        //         {
        //             'card_dimension': {
        //                 'sm': ['calc(35% - 0.5rem)', '240px'],
        //                 'md': ['calc(35% - 0.5rem)', '300px'],
        //                 'lg': ['calc(35% - 0.5rem)', '320px'],
        //                 'xl': ['calc(35% - 0.5rem)', '400px'],
        //                 'minimum': ['611px', '240px'],
        //                 'maximum': ['784px', '400px'],
        //             },
        //             'image': '/images/product/05-01/redeem-pd.webp',
        //             'link': '/',
        //             'glint': true,
        //             'glint_color': '#787772',
        //             'glint_orientation': 'landscape',
        //             'frame_border': '#18436a',
        //             'content_opaque': true,
        //             'content_background': '#2b2b2b',
        //             'content_direction': 'ltr',
        //             'head_percentage': 100,
        //             'body_percentage': 0,
        //             'top_right_corner': 45,
        //             'bottom_left_corner': 45,
        //             'header_fade': false,
        //             'header_padding': `20px`,
        //             'header_fade_color': 'rgba(5,5,5,0.1)',
        //             'header_background': '/images/product/05-01/redeem-bg.webp',
        //             'add_ons': {
        //                 'height': '30px',
        //                 'value': []
        //             },
        //             'bullets': {
        //                 'value': [
        //                     "Purchase the MSI S.T.A.L.K.E.R. 2 co-branded graphics card and receive access to the full S.T.A.L.K.E.R. 2: Heart of Chornobyl Deluxe version gaming experience! Follow the redemption guidelines to claim your game and dive into the immersive world of S.T.A.L.K.E.R. 2.",
        //                 ]
        //             },
        //         },
        //         {
        //             'card_dimension': {
        //                 'sm': ['calc(50% - 0.5rem)', '240px'],
        //                 'md': ['calc(50% - 0.5rem)', '300px'],
        //                 'lg': ['calc(50% - 0.5rem)', '320px'],
        //                 'xl': ['calc(50% - 0.5rem)', '400px'],
        //                 'minimum': ['840px', '240px'],
        //                 'maximum': ['1124px', '400px'],
        //             },
        //             'image': '/images/product/05/1024.png',
        //             'title': 'GeForce RTX™ 4070 Ti SUPER 16G GAMING SLIM STALKER 2 EDITION',
        //             'title_icon': 'bi:gpu-card',
        //             'title_size': 'lg',
        //             'description_size': 'md',
        //             'link': '/',
        //             'glint': true,
        //             'glint_color': '#787772',
        //             'glint_orientation': 'landscape',
        //             'frame_border': '#adadad',
        //             'content_opaque': true,
        //             'content_background': '#2b2b2b',
        //             'content_direction': 'ltr',
        //             'head_percentage': 50,
        //             'body_percentage': 50,
        //             'top_right_corner': 45,
        //             'bottom_left_corner': 45,
        //             'header_fade': false,
        //             'header_padding': `20px`,
        //             'header_fade_color': 'rgba(5,5,5,0.1)',
        //             'header_background': '/images/deco/msi-cloud.jpg',
        //             'body_background': '/images/product/05/kv-bg.webp',
        //             'add_ons': {
        //                 'height': '30px',
        //                 'value': [
        //                     {
        //                         'image': '/images/product/01/add-ons-001.png',
        //                         'alt': '3 months free adobe cloud'
        //                     },
        //                     {
        //                         'image': '/images/product/01/add-ons-002.png',
        //                         'alt': 'Windows 11 ready'
        //                     }
        //                 ]
        //             },
        //             'bullets': {
        //                 'value': [
        //                     "Purchase the MSI S.T.A.L.K.E.R. 2 co-branded graphics card and receive access to the full S.T.A.L.K.E.R. 2: Heart of Chornobyl Deluxe version gaming experience! Follow the redemption guidelines to claim your game and dive into the immersive world of S.T.A.L.K.E.R. 2.",
        //                 ]
        //             },
        //             'sub_bullets': {
        //                 'value': [
        //                     "The redeemed game will be provided as a digital code",
        //                     "Please note that the redemption process is subject to specified terms, and official game activation will depend on the publisher's release schedule."
        //                 ]
        //             }
        //         },
        //     ]
        // },

        {
            'id': 'feature_1',
            'type': 'template',
            'theme': 'light',
            'proximity': null,
            'title': 'Featured',
            'debug': {
                'bg': 'rgba(206,206,206,0.2)',
            },
            'background': '#ffffff',
            'banner':{
                'enabled': false,
                'min_height': 0
            },
            'media': {
                'type': 'image',
                'source': null
            },
            'children': []
        },

        {
            'id': 'feature_2',
            'type': 'full',
            'theme': 'light',
            'proximity': 50,
            'title': 'GEFORCE RTX 50 SERIES',
            'debug': {
                'bg': 'rgba(93,111,146,0.5)',
            },
            'background': '#ffffff',
            'banner':{
                'enabled':false,
                'min_height':0,
                'type': 'image',
                'source_set': {
                    // 'mobile' : '/images/spotlight/bjvxa65ixepu6gbr-0_0_desktop_0_1X.webp',
                    // 'tablet' : '/images/spotlight/bjvxa65ixepu6gbr-0_0_desktop_0_1X.webp',
                    // 'desktop' : '/images/spotlight/bjvxa65ixepu6gbr-0_0_desktop_0_1X.webp',
                    'mobile' : '/images/spotlight/p5oieiwbjl30hu2n-0_0_mobile_0_1X.webp',
                    'tablet' : '/images/spotlight/p5oieiwbjl30hu2n-0_0_tablet_0_1X.webp',
                    'desktop' : '/images/spotlight/pjipbdai5xukdvng-0_0_desktop_0_1X.webp',
                }
            },
            'card_dimension': {
                'xs': ['calc(33.3% - 0.5rem)', '150px'],
                'sm': ['calc(33.3% - 0.5rem)', '190px'],
                'md': ['calc(33.3% - 0.5rem)', '220px'],
                'lg': ['calc(33.3% - 0.5rem)', '280px'],
                'xl': ['calc(33.3% - 0.5rem)', '420px'],
                'minimum': ['600px', '150px'],
                'maximum': ['680px', '420px'],
            },
            'media': {
                'type': 'image',
                //'source': '/images/deco/14669594_5514924.jpg'
                // 'type': 'video',
                // 'source': '/videos/weathering_with_you.mp4',
            },
            'children': [
                {
                    'image': '/images/product/10/h732.png',
                    'title': 'ROG Astral GeForce RTX™ 5090 32GB GDDR7',
                    'title_icon': 'bi:gpu-card',
                    'title_size': 'lg',
                    'description_size': 'sm',
                    'link': '/',
                    'glint': true,
                    'glint_color': '#787772',
                    'glint_orientation': 'landscape',
                    'frame_border': '#e8b156',//#92a7c0
                    'content_opaque': true,
                    'content_background': '#ffffff',
                    'content_direction': 'ltr',
                    'head_percentage': {
                        'xs': 30,
                        'sm': 35,
                        'md': 40,
                        'lg': 50,
                        'xl': 60,
                    },
                    'body_percentage': {
                        'xs': 70,
                        'sm': 65,
                        'md': 60,
                        'lg': 50,
                        'xl': 40,
                    },
                    'top_right_corner': 25,
                    'bottom_left_corner': 45,
                    'header_fade': true,
                    'header_padding': `0px`,
                    'header_fade_color': 'rgba(145,155,141,0.1)',
                    'header_background': '',
                    //'body_background': '/images/deco/ROG-Prism_Wallpaper_FHD.jpg',
                    'body_background_opacity': 0.1,
                    'add_ons': {
                        'height': '30px',
                        'value': [
                            {
                                'image': '/images/product/10/add-ons-001.png',
                                'alt': '1 month free adobe cloud'
                            },
                            {
                                'image': '/images/product/10/add-ons-002.png',
                                'alt': 'Windows 11 ready'
                            },
                        ]
                    },
                    'bullets': {
                        'value': [
                            "ROG Astral GeForce RTX™ 5090 32GB GDDR7 - the first ROG quad-fan graphics card delivering unprecedented airflow and air pressure for optimal cooling performance",
                        ]
                    }
                },
                {
                    'image': '/images/product/11/h732.png',
                    'title': 'ROG Astral GeForce RTX™ 5080 16GB GDDR7',
                    'title_icon': 'bi:gpu-card',
                    'title_size': 'lg',
                    'description_size': 'sm',
                    'link': '/',
                    'glint': true,
                    'glint_color': '#787772',
                    'glint_orientation': 'landscape',
                    'frame_border': '#e8b156',//#92a7c0
                    'content_opaque': true,
                    'content_background': '#ffffff',
                    'content_direction': 'ltr',
                    'head_percentage': {
                        'xs': 30,
                        'sm': 35,
                        'md': 40,
                        'lg': 50,
                        'xl': 60,
                    },
                    'body_percentage': {
                        'xs': 70,
                        'sm': 65,
                        'md': 60,
                        'lg': 50,
                        'xl': 40,
                    },
                    'top_right_corner': 25,
                    'bottom_left_corner': 45,
                    'header_fade': true,
                    'header_padding': `0px`,
                    'header_fade_color': 'rgba(145,155,141,0.1)',
                    'header_background': '',
                    //'body_background': '/images/deco/ROG-Prism_Wallpaper_FHD.jpg',
                    'body_background_opacity': 0.1,
                    'add_ons': {
                        'height': '30px',
                        'value': [
                            {
                                'image': '/images/product/11/add-ons-001.png',
                                'alt': '1 month free adobe cloud'
                            },
                            {
                                'image': '/images/product/11/add-ons-002.png',
                                'alt': 'Windows 11 ready'
                            },
                        ]
                    },
                    'bullets': {
                        'value': [
                            "ROG Astral GeForce RTX™ 5080 16GB GDDR7 - the first ROG quad-fan graphics card delivering unprecedented airflow and air pressure for optimal cooling performance",
                        ]
                    }
                },

            ]
        },
        {
            'id': 'feature_3',
            'type': 'full',
            'theme': 'light',
            'proximity': 50,
            'title': 'ROG Strix GeForce RTX™',
            'debug': {
                'bg': 'rgba(220,220,107,0.2)',
            },
            'background': '#ffffff',
            'banner':{
                'enabled':false,
                'min_height':420,
                'type': 'image',
                'source_set': {
                    'mobile' : '/images/deco/ROG-Prism_Wallpaper_FHD.jpg',
                    'tablet' : '/images/deco/ROG-Prism_Wallpaper_FHD.jpg',
                    'desktop' : '/images/deco/ROG-Prism_Wallpaper_FHD.jpg',
                }
            },
            'card_dimension': {
                'xs': ['calc(33.3% - 0.5rem)', '150px'],
                'sm': ['calc(33.3% - 0.5rem)', '190px'],
                'md': ['calc(33.3% - 0.5rem)', '220px'],
                'lg': ['calc(33.3% - 0.5rem)', '280px'],
                'xl': ['calc(33.3% - 0.5rem)', '420px'],
                'minimum': ['600px', '150px'],
                'maximum': ['680px', '420px'],
            },
            'layer': {
                'type': 'image',
            },
            'media': {
                'type': 'image',
                //'source': '/images/deco/14669594_5514924.jpg'
            },
            'children': [
                {
                    'image': '/images/product/09/h732.png',
                    'title': 'ROG Strix GeForce RTX™ 5070 Ti 16GB GDDR7',
                    'title_icon': 'bi:gpu-card',
                    'title_size': 'md',
                    'description_size': 'sm',
                    'link': '/',
                    'glint': true,
                    'glint_color': '#787772',
                    'glint_orientation': 'landscape',
                    'frame_border': 'silver',
                    'content_opaque': true,
                    'content_background': '#ffffff',
                    'content_direction': 'ltr',
                    'head_percentage': {
                        'xs': 50,
                        'sm': 55,
                        'md': 60,
                        'lg': 60,
                        'xl': 70,
                    },
                    'body_percentage': {
                        'xs': 50,
                        'sm': 45,
                        'md': 40,
                        'lg': 40,
                        'xl': 30,
                    },
                    'top_right_corner': 25,
                    'bottom_left_corner': 45,
                    'header_fade': true,
                    'header_padding': `0px`,
                    'header_fade_color': 'rgba(145,155,141,0.1)',
                    'header_background': '',
                    //'body_background': '/images/deco/bg-kv.png',
                    'body_background_opacity': 0.1,
                    'add_ons': {
                        'height': '30px',
                        'value': [
                            {
                                'image': '/images/product/09/add-ons-001.png',
                                'alt': '1 month free adobe cloud'
                            },
                            {
                                'image': '/images/product/09/add-ons-002.png',
                                'alt': 'Windows 11 ready'
                            },
                        ]
                    },
                    'bullets': {
                        'value': [
                            "The ROG Strix GeForce RTX™ 5070 Ti 16GB GDDR7 with advanced cooling system provides you premium power delivery.",
                        ]
                    }
                },
                {
                    'image': '/images/product/02/h732.png',
                    'title': 'ROG Strix GeForce RTX™ 4090 24GB GDDR6X OC EVA-02 Edition',
                    'title_icon': 'bi:gpu-card',
                    'title_size': 'md',
                    'description_size': 'sm',
                    'link': '/',
                    'glint': true,
                    'glint_color': '#787772',
                    'glint_orientation': 'landscape',
                    'frame_border': 'silver',
                    'content_opaque': true,
                    'content_background': '#ffffff',
                    'content_direction': 'ltr',
                    'head_percentage': {
                        'xs': 30,
                        'sm': 35,
                        'md': 40,
                        'lg': 50,
                        'xl': 60,
                    },
                    'body_percentage': {
                        'xs': 70,
                        'sm': 65,
                        'md': 60,
                        'lg': 50,
                        'xl': 40,
                    },
                    'top_right_corner': 25,
                    'bottom_left_corner': 45,
                    'header_fade': true,
                    'header_padding': `0px`,
                    'header_fade_color': 'rgba(145,155,141,0.1)',
                    'header_background': '',
                    //'body_background': '/images/deco/bg-kv.png',
                    'body_background_opacity': 0.1,
                    'add_ons': {
                        'height': '30px',
                        'value': [
                            {
                                'image': '/images/product/04/add-ons-001.png',
                                'alt': '1 month free adobe cloud'
                            },
                        ]
                    },
                    'bullets': {
                        'value': [
                            "ROG Strix GeForce RTX™ 4090 24GB GDDR6X OC EVA-02 Edition with DLSS 3 and chart-topping thermal performance.",
                            "4-Year Premium Warranty",
                        ]
                    }
                },
                {
                    'image': '/images/product/04/h732.png',
                    'title': 'ROG Strix GeForce RTX™ 4080 16GB GDDR6X White OC Edition',
                    'title_icon': 'bi:gpu-card',
                    'title_size': 'md',
                    'description_size': 'sm',
                    'link': '/',
                    'glint': true,
                    'glint_color': '#787772',
                    'glint_orientation': 'landscape',
                    'frame_border': 'silver',
                    'content_opaque': true,
                    'content_background': '#ffffff',
                    'content_direction': 'ltr',
                    'head_percentage': {
                        'xs': 30,
                        'sm': 35,
                        'md': 40,
                        'lg': 50,
                        'xl': 60,
                    },
                    'body_percentage': {
                        'xs': 70,
                        'sm': 65,
                        'md': 60,
                        'lg': 50,
                        'xl': 40,
                    },
                    'top_right_corner': 25,
                    'bottom_left_corner': 45,
                    'header_fade': true,
                    'header_padding': `0px`,
                    'header_fade_color': 'rgba(145,155,141,0.1)',
                    'header_background': '',
                    //'body_background': '/images/deco/bg-kv.png',
                    'body_background_opacity': 0.1,
                    'add_ons': {
                        'height': '30px',
                        'value': [
                            {
                                'image': '/images/product/04/add-ons-001.png',
                                'alt': '1 month free adobe cloud'
                            },
                        ]
                    },
                    'bullets': {
                        'value': [
                            "ROG Strix GeForce RTX™ 4080 16GB GDDR6X White OC Edition with DLSS 3 and chart-topping thermal performance.",
                            "4-Year Premium Warranty",
                        ]
                    }
                },
                {
                    'image': '/images/product/03/h732.png',
                    'title': 'ROG Strix GeForce RTX™ 3080 OC Edition 12GB',
                    'title_icon': 'bi:gpu-card',
                    'title_size': 'md',
                    'description_size': 'sm',
                    'link': '/',
                    'glint': true,
                    'glint_color': '#787772',
                    'glint_orientation': 'landscape',
                    'frame_border': 'silver',
                    'content_opaque': true,
                    'content_background': '#ffffff',
                    'content_direction': 'ltr',
                    'head_percentage': {
                        'xs': 30,
                        'sm': 35,
                        'md': 40,
                        'lg': 50,
                        'xl': 60,
                    },
                    'body_percentage': {
                        'xs': 70,
                        'sm': 65,
                        'md': 60,
                        'lg': 50,
                        'xl': 40,
                    },
                    'top_right_corner': 25,
                    'bottom_left_corner': 45,
                    'header_fade': true,
                    'header_padding': `0px`,
                    'header_fade_color': 'rgba(145,155,141,0.1)',
                    'header_background': '',
                    //'body_background': '/images/deco/bg-kv.png',
                    'body_background_opacity': 0.1,
                    'bullets': {
                        'value': [
                            "ROG Strix GeForce RTX™ 3080 OC Edition 12GB GDDR6X with LHR offers a buffed-up design that delivers chart-topping thermal performance."
                        ]
                    }
                },
                {
                    'image': '/images/product/08/h732.png',
                    'title': 'ROG-STRIX-GeForce-RTX-3080-GUNDAM-EDITION',
                    'title_icon': 'bi:gpu-card',
                    'title_size': 'md',
                    'description_size': 'sm',
                    'link': '/',
                    'glint': true,
                    'glint_color': '#787772',
                    'glint_orientation': 'landscape',
                    'frame_border': 'silver',
                    'content_opaque': true,
                    'content_background': '#ffffff',
                    'content_direction': 'ltr',
                    'head_percentage': {
                        'xs': 30,
                        'sm': 35,
                        'md': 40,
                        'lg': 50,
                        'xl': 60,
                    },
                    'body_percentage': {
                        'xs': 70,
                        'sm': 65,
                        'md': 60,
                        'lg': 50,
                        'xl': 40,
                    },
                    'top_right_corner': 25,
                    'bottom_left_corner': 45,
                    'header_fade': true,
                    'header_padding': `0px`,
                    'header_fade_color': 'rgba(145,155,141,0.1)',
                    'header_background': '',
                    'body_background': '/images/deco/bg-kv.png',
                    'body_background_opacity': 0.1,
                    'add_ons': {
                        'height': '30px',
                        'value': [
                            {
                                'image': '/images/product/08/add-ons-001.png',
                                'alt': '1 month free adobe cloud'
                            },
                            {
                                'image': '/images/product/08/add-ons-002.png',
                                'alt': 'Windows 11 ready'
                            },
                        ]
                    },
                    'bullets': {
                        'value': [
                            "ROG Strix GeForce RTX™ 3080 GUNDAM EDITION with design influence from the premier GUNDAM mech and chart-topping gaming performance.",
                            "OC Edition: Boost Clock 1935 MHz (OC Mode)/ 1905 MHz (Gaming Mode)"
                        ]
                    }
                },
            ]
        },
        {
            'id': 'feature_4',
            'type': 'full',
            'theme': 'light',
            'proximity': 50,
            'title': 'ProArt Series',
            'debug': {
                'bg': 'rgba(150,198,139,0.2)',
            },
            'background': '#ffffff',
            'banner':{
                'enabled':true,
                'min_height':420,
                'type': 'image',
                'source_set': {
                    'mobile' : '/images/spotlight/pro-art-4080.png',
                    'tablet' : '/images/spotlight/pro-art-4080.png',
                    'desktop' : '/images/spotlight/pro-art-4080.png',
                }
            },
            'card_dimension': {
                'xs': ['calc(33.3% - 0.5rem)', '150px'],
                'sm': ['calc(33.3% - 0.5rem)', '190px'],
                'md': ['calc(33.3% - 0.5rem)', '220px'],
                'lg': ['calc(33.3% - 0.5rem)', '280px'],
                'xl': ['calc(33.3% - 0.5rem)', '420px'],
                'minimum': ['600px', '150px'],
                'maximum': ['680px', '420px'],
            },
            'layer': {
                'type': 'image',
            },
            'media': {
                //'type': 'video',
                //'source': '/videos/7020083_Gold_Molecular_3840x2160.mp4',
                //'source_type': 'video/mp4',
                'type': 'image',
                //'source': '/images/deco/14669594_5514924.jpg'
            },
            'children': [
                {
                    'image': '/images/product/07/fwebp.webp',
                    'title': 'ProArt GeForce RTX™ 4080 SUPER 16GB GDDR6X OC Edition',
                    'title_icon': 'bi:gpu-card',
                    'title_size': 'md',
                    'description_size': 'sm',
                    'link': '/',
                    'glint': true,
                    'glint_color': '#787772',
                    'glint_orientation': 'landscape',
                    'frame_border': '#cbcbcb',
                    'content_opaque': true,
                    'content_background': '#ffffff',
                    'content_direction': 'ltr',
                    'head_percentage': {
                        'xs': 30,
                        'sm': 35,
                        'md': 40,
                        'lg': 50,
                        'xl': 60,
                    },
                    'body_percentage': {
                        'xs': 70,
                        'sm': 65,
                        'md': 60,
                        'lg': 50,
                        'xl': 40,
                    },
                    'top_right_corner': 25,
                    'bottom_left_corner': 45,
                    'header_fade': true,
                    'header_padding': `10px`,
                    'header_fade_color': 'rgba(145,155,141,0.1)',
                    'header_background': null,
                    'body_background': null,
                    'add_ons': {
                        'height': '30px',
                        'value': [
                            {
                                'image': '/images/product/07/add-ons-001.png',
                                'alt': '3 months free adobe cloud'
                            },
                            {
                                'image': '/images/product/07/add-ons-002.png',
                                'alt': '1 month free adobe cloud'
                            },
                            {
                                'image': '/images/product/07/add-ons-003.png',
                                'alt': 'Windows 11 ready'
                            }
                        ]
                    },
                    'bullets': {
                        'value': [
                            "AI Performance: 855 AI TOPS",
                            "SFF-Ready Enthusiast GeForce Card for small-form-factor builds",
                        ]
                    },
                },
                {
                    'image': '/images/product/06/fwebp.webp',
                    'title': 'ProArt GeForce RTX™ 4070 Ti SUPER 16GB GDDR6X OC Edition',
                    'title_icon': 'bi:gpu-card',
                    'title_size': 'md',
                    'description_size': 'sm',
                    'link': '/',
                    'glint': true,
                    'glint_color': '#787772',
                    'glint_orientation': 'landscape',
                    'frame_border': '#cbcbcb',
                    'content_opaque': true,
                    'content_background': '#ffffff',
                    'content_direction': 'ltr',
                    'head_percentage': {
                        'xs': 30,
                        'sm': 35,
                        'md': 40,
                        'lg': 50,
                        'xl': 60,
                    },
                    'body_percentage': {
                        'xs': 70,
                        'sm': 65,
                        'md': 60,
                        'lg': 50,
                        'xl': 40,
                    },
                    'top_right_corner': 25,
                    'bottom_left_corner': 45,
                    'header_fade': true,
                    'header_padding': `10px`,
                    'header_fade_color': 'rgba(145,155,141,0.1)',
                    'header_background': null,
                    'body_background': null,
                    'add_ons': {
                        'height': '30px',
                        'value': [
                            {
                                'image': '/images/product/06/add-ons-001.png',
                                'alt': '3 months free adobe cloud'
                            },
                            {
                                'image': '/images/product/06/add-ons-002.png',
                                'alt': '1 month free adobe cloud'
                            },
                            {
                                'image': '/images/product/06/add-ons-003.png',
                                'alt': 'Windows 11 ready'
                            }
                        ]
                    },
                    'bullets': {
                        'value': [
                            "OC mode: 2670 MHz (OC mode)/ 2640 MHz (Default mode)",
                            "SFF-Ready Enthusiast GeForce Card for small-form-factor builds",
                        ]
                    },
                },
                {
                    'image': '/images/product/01/fwebp.webp',
                    'title': 'ProArt GeForce RTX™ 4070 SUPER 12GB GDDR6X OC Edition',
                    'title_icon': 'bi:gpu-card',
                    'title_size': 'md',
                    'description_size': 'sm',
                    'link': '/',
                    'glint': true,
                    'glint_color': '#787772',
                    'glint_orientation': 'landscape',
                    'frame_border': '#cbcbcb',
                    'content_opaque': true,
                    'content_background': '#ffffff',
                    'content_direction': 'ltr',
                    'head_percentage': {
                        'xs': 30,
                        'sm': 35,
                        'md': 40,
                        'lg': 50,
                        'xl': 60,
                    },
                    'body_percentage': {
                        'xs': 70,
                        'sm': 65,
                        'md': 60,
                        'lg': 50,
                        'xl': 40,
                    },
                    'top_right_corner': 25,
                    'bottom_left_corner': 45,
                    'header_fade': true,
                    'header_padding': `10px`,
                    'header_fade_color': 'rgba(145,155,141,0.1)',
                    'header_background': null,
                    'body_background': null,
                    'add_ons': {
                        'height': '30px',
                        'value': [
                            {
                                'image': '/images/product/01/add-ons-001.png',
                                'alt': '3 months free adobe cloud'
                            },
                            {
                                'image': '/images/product/01/add-ons-002.png',
                                'alt': 'Windows 11 ready'
                            }
                        ]
                    },
                    'bullets': {
                        'value': [
                            "NVIDIA Studio: RTX and AI-accelerated creator apps, exclusive AI software, and Studio Drivers for unmatched creativity and performance",
                            "SFF-Ready Enthusiast GeForce Card for small-form-factor builds",
                        ]
                    },
                },
            ]
        },
        // {
        //     'id': 'feature_5',
        //     'type': 'full',
        //     'theme': 'light',
        //     'proximity': 63,
        //     'title': 'MEOW SET',
        //     'debug': {
        //         'bg': 'rgba(158,107,81,0.5)',
        //     },
        //     'background': '#ffffff',
        //     'banner':{
        //         'enabled':false,
        //         'min_height':380,
        //         'type': 'image',
        //         'source': null
        //     },
        //     'card_dimension': {
        //         'xs': ['calc(25% - 0.5rem)', '90px'],
        //         'sm': ['calc(25% - 0.5rem)', '130px'],
        //         'md': ['calc(25% - 0.5rem)', '180px'],
        //         'lg': ['calc(25% - 0.5rem)', '230px'],
        //         'xl': ['calc(25% - 0.5rem)', '280px'],
        //         'minimum': ['400px', '90px'],
        //         'maximum': ['453px', '280px'],
        //     },
        //     'media': {
        //         'type': 'image',
        //         'source': '/images/carousel/f415740d-5951-4b5d-af98-1404e9c65df5-1920-min-90.webp'
        //     },
        //     'children': [
        //         {
        //             'image': '/images/product/202306201506003693.webp',
        //             'title': 'Segotep Memphis-S Meow PC Case',
        //             'title_icon': 'octicon:circuit-board',
        //             'title_size': 'md',
        //             'description_size': 'sm',
        //             'link': '/',
        //             'glint': true,
        //             'glint_color': '#a97147',
        //             'glint_orientation': 'landscape',
        //             'frame_border': '#e3b98f',
        //             'content_opaque': true,
        //             'content_background': '#ffffff',
        //             'content_direction': 'ltr',
        //             'head_percentage': {
        //                 'xs': 30,
        //                 'sm': 35,
        //                 'md': 40,
        //                 'lg': 50,
        //                 'xl': 60,
        //             },
        //             'body_percentage': {
        //                 'xs': 70,
        //                 'sm': 65,
        //                 'md': 60,
        //                 'lg': 50,
        //                 'xl': 40,
        //             },
        //             'top_right_corner': 25,
        //             'bottom_left_corner': 45,
        //             'header_fade': false,
        //             'header_padding': `0px`,
        //             'header_fade_color': 'rgba(5,5,5,0.1)',
        //             'header_background': null,
        //             //'body_background': '/images/deco/kv_layout.jpg',
        //             'body_background_opacity': 0.1,
        //             'bullets': {
        //                 'value': [
        //                     "M-ATX / ITX supported",
        //                     "Up to three 2.5\" SSDs and one 3.5\" HDD",
        //                     "Up to 240mm rad. of AIO coolers Supports up to 170mm tall CPU coolers"
        //                 ]
        //             },
        //         },
        //         {
        //             'image': '/images/product/c76383ac-e6c0-4725-bec0-b171449c5960.webp',
        //             'title': 'COLORFIRE B760M-MEOW WIFI D5 ORANGE',
        //             'title_icon': 'octicon:circuit-board',
        //             'title_size': 'md',
        //             'description_size': 'sm',
        //             'link': '/',
        //             'glint': true,
        //             'glint_color': '#a97147',
        //             'glint_orientation': 'landscape',
        //             'frame_border': '#e3b98f',
        //             'content_opaque': true,
        //             'content_background': '#ffffff',
        //             'content_direction': 'ltr',
        //             'head_percentage': {
        //                 'xs': 30,
        //                 'sm': 35,
        //                 'md': 40,
        //                 'lg': 50,
        //                 'xl': 60,
        //             },
        //             'body_percentage': {
        //                 'xs': 70,
        //                 'sm': 65,
        //                 'md': 60,
        //                 'lg': 50,
        //                 'xl': 40,
        //             },
        //             'top_right_corner': 25,
        //             'bottom_left_corner': 45,
        //             'header_fade': false,
        //             'header_padding': `0px`,
        //             'header_fade_color': 'rgba(5,5,5,0.1)',
        //             'header_background': null,
        //             //'body_background': '/images/deco/kv_layout.jpg',
        //             'body_background_opacity': 0.1,
        //             'bullets': {
        //                 'value': [
        //                     "Support the 14th/13th and 12th gen. Intel adapting to the LGA 1700",
        //                     "Support dual channel DDR5-7200 (OC) MHz memory",
        //                     "Provide 3 PCIe 4.0 x4 M.2 SSD slots",
        //                     //"One USB 3.2 Gen 2 Type-C and two USB 3.2 Gen 1 Type-A high-speed rear interfaces"
        //                 ]
        //             },
        //         },
        //         {
        //             'image': '/images/product/fc44dd4e-40ed-49df-bd9e-bc210dfbaf7c.webp',
        //             'title': 'COLORFIRE GeForce RTX 4060 MEOW-ORG 8GB-V',
        //             'title_icon': 'bi:gpu-card',
        //             'title_size': 'md',
        //             'description_size': 'sm',
        //             'link': '/',
        //             'glint': true,
        //             'glint_color': '#a97147',
        //             'glint_orientation': 'landscape',
        //             'frame_border': '#e3b98f',
        //             'content_opaque': true,
        //             'content_background': '#ffffff',
        //             'content_direction': 'ltr',
        //             'head_percentage': {
        //                 'xs': 30,
        //                 'sm': 35,
        //                 'md': 40,
        //                 'lg': 50,
        //                 'xl': 60,
        //             },
        //             'body_percentage': {
        //                 'xs': 70,
        //                 'sm': 65,
        //                 'md': 60,
        //                 'lg': 50,
        //                 'xl': 40,
        //             },
        //             'top_right_corner': 25,
        //             'bottom_left_corner': 45,
        //             'header_fade': false,
        //             'header_padding': `5px`,
        //             'header_fade_color': 'rgba(5,5,5,0.1)',
        //             //'body_background': '/images/deco/kv_layout.jpg',
        //             'body_background_opacity': 0.1,
        //             'bullets': {
        //                 'value': [
        //                     "Efficient and durable heat dissipation.",
        //                     "Adjustable lighting effects via iGame Center."
        //                 ]
        //             },
        //         },
        //     ]
        // },
        
        // {
        //     'id': 'feature_4',
        //     'type': 'row',
        //     'proximity': '50',
        //     'title': 'ROW 1',
        //     'bg': 'yellow',
        //     'media': {
        //         'type': 'image',
        //         'source': '/images/cod-bg-hero.png'
        //     }
        // },
        // {
        //     'id': 'feature_5',
        //     'type': 'row',
        //     'proximity': '50',
        //     'title': 'ROW 2',
        //     'bg': 'orange',
        //     'media': {
        //         'type': 'image',
        //         'source': '/images/cod-bg-hero.png'
        //     }
        // },
        // {
        //     'id': 'feature_6',
        //     'type': 'row',
        //     'proximity': '50',
        //     'title': 'ROW 3',
        //     'bg': 'indigo',
        //     'media': {
        //         'type': 'image',
        //         'source': '/images/cod-bg-hero.png'
        //     }
        // },
        // {
        //     'id': 'feature_7',
        //     'type': 'row',
        //     'proximity': '50',
        //     'title': 'ROW 4',
        //     'bg': 'azure',
        //     'media': {
        //         'type': 'image',
        //         'source': '/images/cod-bg-hero.png'
        //     }
        // },
    ]
};