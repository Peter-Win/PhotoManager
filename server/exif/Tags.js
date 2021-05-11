// https://exiv2.org/tags-xmp-exifEX.html

const Tags = [];

Tags[0x0000] = 'GPSVersionID';
Tags[0x0001] = 'GPSLatitudeRef';
Tags[0x0002] = 'GPSLatitude';
Tags[0x0003] = 'GPSLongitudeRef';
Tags[0x0004] = 'GPSLongitude';
Tags[0x0005] = 'GPSAltitudeRef';
Tags[0x0006] = 'GPSAltitude';
Tags[0x0007] = 'GPSTimeStamp';
Tags[0x0008] = 'GPSSatellites';
Tags[0x0009] = 'GPSStatus';
Tags[0x000A] = 'GPSMeasureMode';
Tags[0x000B] = 'GPSDOP'; // Measurement precision 
Tags[0x000C] = 'GPSSpeedRef'; // Speed unit
Tags[0x000D] = 'GPSSpeed'; // Speed of GPS receiver
Tags[0x000E] = 'GPSTrackRef'; // Reference for direction of movement 
Tags[0x000F] = 'GPSTrack'; // Direction of movement
Tags[0x0010] = 'GPSImgDirectionRef'; // Reference for direction of image 
Tags[0x0011] = 'GPSImgDirection'; // Direction of image 
Tags[0x0012] = 'GPSMapDatum'; // Geodetic survey data used 
Tags[0x0013] = 'GPSDestLatitudeRef'; // Reference for latitude of destination 
Tags[0x0014] = 'GPSDestLatitude'; // Latitude of destination 
Tags[0x0015] = 'GPSDestLongitudeRef'; // Reference for longitude of destination 
Tags[0x0016] = 'GPSDestLongitude'; // Longitude of destination
Tags[0x0017] = 'GPSDestBearingRef'; // Reference for bearing of destination 
Tags[0x0018] = 'GPSDestBearing'; // Bearing of destination
Tags[0x0019] = 'GPSDestDistanceRef'; // Reference for distance to destination 
Tags[0x001A] = 'GPSDestDistance'; // Distance to destination 
Tags[0x001B] = 'GPSProcessingMethod'; // Name of GPS processing method 
Tags[0x001C] = 'GPSAreaInformation'; // Name of GPS area 
Tags[0x001D] = 'GPSDateStamp';
Tags[0x001E] = 'GPSDifferential'; // GPS differential correction 

Tags[0x0100] = 'ImageWidth';
Tags[0x0101] = 'ImageLength';
Tags[0x0102] = 'BitsPerSample';
Tags[0x0103] = 'Compression';
Tags[0x0106] = 'PhotometricInterpretation';

Tags[0x010E] = 'ImageDescription'; //  Image title
Tags[0x010F] = 'Make'; //  Image input equipment manufacturer
Tags[0x0110] = 'Model'; // Image input equipment model
Tags[0x0111] = 'StripOffsets';
Tags[0x0112] = 'Orientation';
Tags[0x0115] = 'SamplesPerPixel';
Tags[0x0116] = 'RowsPerStrip';
Tags[0x0117] = 'StripByteCounts';

Tags[0x011A] = 'XResolution';
Tags[0x011B] = 'YResolution';
Tags[0x011C] = 'PlanarConfiguration';

Tags[0x0128] = 'ResolutionUnit';
Tags[0x012D] = 'TransferFunction';

Tags[0x0131] = 'Software'; //  Software used 
Tags[0x0132] = 'DateTime'; //  File change date and time 

Tags[0x013B] = 'Artist'; // Person who created the image 
Tags[0x013E] = 'WhitePoint';
Tags[0x013F] = 'PrimaryChromaticities';


Tags[0x0201] = 'JPEGInterchangeFormat';
Tags[0x0202] = 'JPEGInterchangeFormatLength';

Tags[0x0211] = 'YCbCrCoefficients'; // Color space transformation matrix coefficients
Tags[0x0212] = 'YCbCrSubSampling';
Tags[0x0213] = 'YCbCrPositioning';
Tags[0x0214] = 'ReferenceBlackWhite'; // Pair of black and white reference values

Tags[0x8298] = 'Copyright'; // Copyright holder 
Tags[0x829A] = 'ExposureTime';
Tags[0x829D] = 'FNumber';

Tags[0x8769] = 'Exif IFD Pointer';
Tags[0x8822] = 'ExposureProgram';
Tags[0x8824] = 'SpectralSensitivity';
Tags[0x8825] = 'GPS Info IFD Pointer';
Tags[0x8827] = 'ISOSpeedRatings';
Tags[0x8828] = 'OECF'; // Optoelectric conversion factor 
Tags[0x9000] = 'ExifVersion'; // Exif version
Tags[0x9003] = 'DateTimeOriginal'; // Date and time of original data generation
Tags[0x9004] = 'DateTimeDigitized'; // Date and time of digital data generation

Tags[0x9101] = 'ComponentsConfiguration'; //  Meaning of each component
Tags[0x9102] = 'CompressedBitsPerPixel'; // Image compression mode 

Tags[0x9201] = 'ShutterSpeedValue';
Tags[0x9202] = 'ApertureValue';
Tags[0x9203] = 'BrightnessValue';
Tags[0x9204] = 'ExposureBiasValue';
Tags[0x9205] = 'MaxApertureValue';
Tags[0x9206] = 'SubjectDistance';
Tags[0x9207] = 'MeteringMode';
Tags[0x9208] = 'LightSource';
Tags[0x9209] = 'Flash';
Tags[0x920A] = 'FocalLength';
Tags[0x9214] = 'SubjectArea';

Tags[0x927C] = 'MakerNote';
Tags[0x9286] = 'UserComment';
Tags[0x9290] = 'SubSecTime'; //  DateTime subseconds
Tags[0x9291] = 'SubSecTimeOriginal'; // DateTimeOriginal subseconds
Tags[0x9292] = 'SubSecTimeDigitized'; // DateTimeDigitized subseconds

Tags[0xA000] = 'FlashpixVersion'; 
Tags[0xA001] = 'ColorSpace';
Tags[0xA002] = 'PixelXDimension'; // Valid image width
Tags[0xA003] = 'PixelYDimension'; // Valid image height 
Tags[0xA004] = 'RelatedSoundFile'; // Related audio file 
Tags[0xA005] = 'Interoperability IFD Pointer';

Tags[0xA20B] = 'FlashEnergy';
Tags[0xA20C] = 'SpatialFrequencyResponse';
Tags[0xA20E] = 'FocalPlaneXResolution';
Tags[0xA20F] = 'FocalPlaneYResolution';
Tags[0xA210] = 'FocalPlaneResolutionUnit';
Tags[0xA214] = 'SubjectLocation';
Tags[0xA215] = 'ExposureIndex';
Tags[0xA217] = 'SensingMethod';

Tags[0xA300] = 'FileSource';
Tags[0xA301] = 'SceneType';
Tags[0xA302] = 'CFAPattern';

Tags[0xA401] = 'CustomRendered'; // Custom image processing
Tags[0xA402] = 'ExposureMode';
Tags[0xA403] = 'WhiteBalance';
Tags[0xA404] = 'DigitalZoomRatio';
Tags[0xA405] = 'FocalLengthIn35mmFilm';
Tags[0xA406] = 'SceneCaptureType';
Tags[0xA407] = 'GainControl';
Tags[0xA408] = 'Contrast';
Tags[0xA409] = 'Saturation';
Tags[0xA40A] = 'Sharpness';
Tags[0xA40B] = 'DeviceSettingDescription';
Tags[0xA40C] = 'SubjectDistanceRange';

Tags[0xA420] = 'ImageUniqueID';
Tags[0xA432] = 'LensSpecification'; // notes minimum focal length, maximum focal length, minimum F number in the minimum focal length, and minimum F number in the maximum focal length, which are specification information for the lens that was used in photography.
Tags[0xA433] = 'LensMake';
Tags[0xA434] = 'LensModel';
Tags[0xA435] = 'LensSerialNumber';

module.exports = {Tags};