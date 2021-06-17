# Customizing ghost start

## adding scss
- create gulp task
- move relevant declarations to scss files
- create folder structure for scss
- test it out

## moving to atomic design and layout, component based declarations
- identifying structure
- split old code and declarations to new

Files to edit:
### Main
#### `default.hbs`

`error.hbs`
`author.hbs`
`index.hbs`
`post.hbs`
`tag.hbs`
### Partials
`card.hbs`
### Members
`account.hbs`
`signin.hbs`
`signup.hbs`

Will there be any partials?

Adjusting css classes and mapping old structure to new one
#### layouts
- gh-container moving to l-container
- l-grid
- gh-main needed? go with main instead
#### components
- gh-head => c-header
- gh-head-logo
- gh-head-inner
- gh-head-menu
- gh-head-actions
- gh-head-actions-list

- gh-foot
- gh-foot-menu
- gh-foot-meta
#### defining utility class

#### defining the base

#### defining abstracts mixins and functions
- mixins folder to keep mixins readable
- colors, typography as own variable file
- breaking up breakpoints
- marry everything



## What to fix besides from base styles
.kg-bookmark
galleries
rss feed icon bug # or just remove
navigation