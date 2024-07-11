export interface WebhookPayload<T> {
  object: string;
  entry: {
    id: string;
    changes: {
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts: {
          profile: {
            name: string;
          };
          wa_id: string;
        }[];
        messages: T[];
      };
      field: string;
    }[];
  }[];
}

interface Message {
  from: string;
  id: string;
  timestamp: string;
}

export interface TextMessage extends Message {
  type: 'text';
  text: {
    body: string;
  };
}

export interface ReactionMessage extends Message {
  type: 'reaction';
  reaction: {
    message_id: string,
    emoji: string
  }
}

interface ImageMessage extends Message {
  type: 'image',
  image: {
    caption: string;
    mime_type: string;
    sha256: string;
    id: string;
  };
}

interface VideoMessage extends Message {
  type: 'video';
  video: {
    caption: string;
    mime_type: string;
    sha256: string;
    id: string;
  };
}

interface AudioMessage extends Message {
  audio: {
    mime_type: string;
    sha256: string;
    id: string;
  };
}

interface DocumentMessage extends Message {
  document: {
    caption: string;
    filename: string;
    mime_type: string;
    sha256: string;
    id: string;
  };
}
