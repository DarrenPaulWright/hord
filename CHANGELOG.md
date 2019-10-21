# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [0.5.7] - 2019-10-21
### Security
- Updated dependencies

## [0.5.6] - 2019-10-09
### Security
- Updated dependencies

## [0.5.5] - 2019-10-06
### Fixed
- In Schema.enforce, don't try to set a value if the item is not an object

## [0.5.4] - 2019-10-05
### Fixed
- Nested Models and Schemas are now handled like other datatypes

## [0.5.3] - 2019-10-01
### Fixed
- Model should process errors when apply is called

### Security
- Updated dependencies

## [0.5.2] - 2019-08-28
### Security
- Updated dependencies

### Added
- [compare](docs/compare.md)

## [0.5.1] - 2019-07-29
### Security
- Updated dependencies

### Fixed
- Fixed compare function when NaN is provided

## [0.5.0] - 2019-07-18
### Added
- [List](docs/List.md)
  - Added .someRight method
  - Added .intersection method
- [Collection](docs/Collection.md)
  - Added support for query operators
  - Improved performance when deriving new collections with indexes
    
### Changed
- [Schema](docs/Schema.md)
  - Improved support for nested Schemas
  - Added support for '*' key
- [Model](docs/Model.md)
  - Improved support for nested Schemas/Models
- [List](docs/List.md)
    - .concat now returns a new List instead of mutating the calling list.

## [0.4.1] - 2019-07-01
### Added
- Method 'extend' in [Schema](docs/Schema.md)
- Method 'extend' in [Model](docs/Model.md)

## [0.4.0] - 2019-07-01
### Added
- Indexing in [Collection](docs/Collection.md)

## [0.3.2] - 2019-06-25
### Changed
- Model:
  - Exporting MODEL_ERROR_LEVEL.
  - Now accepts multiple callbacks for onChange and onError.
- List:
  - .values() now returns a shallow clone of values.
  - Binary search:
    - No longer compares a non-existent value at index array.length
    - Compares against the matcher object more consistently
- Collection
  - Predicate can now be deeply nested.
  - Fixed model application in push and unshift

## [0.3.1] - 2019-06-20
- Fixed Tests

## [0.3.0] - 2019-06-20
### Added
- [Schema](docs/Schema.md)
- [Model](docs/Model.md)
- [Collection](docs/Collection.md)

## [0.2.4] - 2019-06-13
- Improved documentation

## [0.2.3] - 2019-06-07
- Improved documentation

## [0.2.2] - 2019-06-05
### Security
- Updated dependencies

## [0.2.1] - 2019-04-03
- Fixed build environment

## [0.2.0] - 2019-03-16
### Changed
- [List](docs/List.md) methods findAll, filter, and slice now return new Lists with the same sorter as the calling list 
- [List](docs/List.md) uses a better default sorter with [default-compare](https://www.npmjs.com/package/default-compare)

### Added
- Method discardAll to [List](docs/List.md)
- Method unique to [List](docs/List.md)

## [0.1.3] - 2019-02-26
### Added
- Added the method addUnique to [List](docs/List.md)

## [0.1.2] - 2019-02-25
### Changed
- Fixed a bug in [List](docs/List.md) when finding items at the beginning of the array

## [0.1.1] - 2019-02-06
### Changed
- Removed .flat and .flatMap from [List](docs/List.md)

## 0.1.0 - 2019-02-06
### Added
- [List](docs/List.md)

[0.5.7]: https://github.com/DarrenPaulWright/hord/compare/v0.5.5...v0.5.7
[0.5.6]: https://github.com/DarrenPaulWright/hord/compare/v0.5.5...v0.5.6
[0.5.5]: https://github.com/DarrenPaulWright/hord/compare/v0.5.4...v0.5.5
[0.5.4]: https://github.com/DarrenPaulWright/hord/compare/v0.5.3...v0.5.4
[0.5.3]: https://github.com/DarrenPaulWright/hord/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/DarrenPaulWright/hord/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/DarrenPaulWright/hord/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/DarrenPaulWright/hord/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/DarrenPaulWright/hord/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/DarrenPaulWright/hord/compare/v0.3.2...v0.4.0
[0.3.2]: https://github.com/DarrenPaulWright/hord/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/DarrenPaulWright/hord/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/DarrenPaulWright/hord/compare/v0.2.4...v0.3.0
[0.2.4]: https://github.com/DarrenPaulWright/hord/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/DarrenPaulWright/hord/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/DarrenPaulWright/hord/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/DarrenPaulWright/hord/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/DarrenPaulWright/hord/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/DarrenPaulWright/hord/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/DarrenPaulWright/hord/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/DarrenPaulWright/hord/compare/v0.1.0...v0.1.1
