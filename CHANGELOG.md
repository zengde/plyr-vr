<a name="1.0.0"></a>
## [1.0.0](https://github.com/zengde/plyr-vr/compare/v0.0.3...v1.0.0) (2020-03-25)

### Features

* update build and dev tool to vite
* upgrade to videojs-vr(2.0.0)
* vendor threejs files
* Add an option to prevent clicks from toggling playback
* add option to change the detail level of the projection sphere

### Bug Fixes

* include edited three.js examples in module dist files
* separate 180_LR/180_TB, add 180_MONO, fix cropping in 180 views.

### Chores

* **pkg.json:** set license field back to MIT
* skip syntax check with vjsverify due to three
* don't run tests on version
* udpate generator-helpers
* fix publish by skipping require verification
* update dependencies, readme, examples, and switch to github actions ci

### Documentation

* add caveats section for safari
* correct some typos
* fixed a typo in README 

### Tests

* Add a test, fix the build, update generator version

### BREAKING CHANGES

* This drops support for older browsers such as IE

<a name="0.0.3"></a>
## [0.0.3](https://github.com/zengde/plyr-vr/compare/v0.0.2...v0.0.3) (2020-03-25)

### Features
* upgrade to videojs-vr(1.7.2)

### Bug Fixes

* null check fullscreen toggle to fix ios without it

<a name="0.0.2"></a>
## [0.0.2](https://github.com/zengde/plyr-vr/compare/v0.0.1...v0.0.2) (2020-03-25)

### Features
* upgrade to videojs-vr(1.7.1)

### Bug Fixes

* increase touchmove threshold for "taps" on mobile

<a name="0.0.1"></a>
# [0.0.1](https://github.com/zengde/plyr-vr/releases/tag/0.0.1) (2019-11-09)

### Features
* initial videojs-vr(1.7.0)