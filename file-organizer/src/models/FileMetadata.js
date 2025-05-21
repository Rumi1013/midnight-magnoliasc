// FileMetadata.js - MongoDB model for file metadata

import mongoose from "mongoose";

const fileMetadataSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  extension: {
    type: String,
    index: true
  },
  size: {
    type: Number,
    required: true
  },
  created: {
    type: Date
  },
  modified: {
    type: Date
  },
  accessed: {
    type: Date
  },
  mimeType: {
    type: String
  },
  fileType: {
    type: String
  },
  hash: {
    type: String,
    index: true
  },
  tags: [{
    type: String,
    index: true
  }],
  category: {
    type: String,
    index: true
  },
  scanDate: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for common queries
fileMetadataSchema.index({ hash: 1, size: 1 });
fileMetadataSchema.index({ extension: 1, size: 1 });
fileMetadataSchema.index({ category: 1, extension: 1 });

const FileMetadata = mongoose.model("FileMetadata", fileMetadataSchema);

export default FileMetadata;
