var icons = ['a.png', 'b.png', 'c.png']//, 'd.png', 'e.png', 'f.png', 'g.png', 'h.png', 'i.png', 'j.png'];
var names = ['Angular', 'Typescript', 'React']//, 'NodeJS', 'Vue', 'Visual Studio Code', 'Postman', 'Bootstrap', 'GitHub', 'Electron'];
var descr = [
    `JS Framework by Google that extends HTML markup, adds two-way binding of M-V layers.`,
    `A superset of JS developed by Microsoft, characterized by adding static typing (optional).`,
    `Facebook's JS library used to build single page applications.`]/*,
    `JS runtime often used for a serverside 'back-end', built on Chrome's V8 JS engine.`,
    `JS Framework for building user interfaces that allows for incremental adoption.`,
    `Extensible cross-platform code editor by Microsoft.`,
    `Tool for debugging Application Programming Interfaces (APIs).`,
    `CSS and JS Framework for building responsive, mobile-first projects.`,
    `Online platform for hosting source code, managing projects and building software collaboratively.`,
    `Toolkit that allows developers to create cross-platform desktop applications using web technologies.`
];*/

var helpers = require('./helpers')

module.exports = {
    getIcons: function () {
        return icons;
    },
    getNames: function () {
        return names;
    },
    getDescriptions: function () {
        return descr;
    },
    getRandomLists: function () {
        var lists = {
            Icons: {
                name: "Icons:",
                allowedTypes: ['Icon'],
                items: []
            },
            Names: {
                name: "Names:",
                allowedTypes: ['Name'],
                items: []
            },
            Descriptions: {
                name: "Description:",
                allowedTypes: ['Description'],
                items: []
            }
        }

        icons.forEach(i => {
            lists.Icons.items.push({
                type: 'Icon',
                label: i
            })
        });

        names.forEach(n => {
            lists.Names.items.push({
                type: 'Name',
                label: n
            })
        });

        descr.forEach(d => {
            lists.Descriptions.items.push({
                type: 'Description',
                label: d
            })
        });

        lists.Names.items = helpers.shuffle(lists.Names.items);
        lists.Descriptions.items = helpers.shuffle(lists.Descriptions.items);

        return lists;
    }
}