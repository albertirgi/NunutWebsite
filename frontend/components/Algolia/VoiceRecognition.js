import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { VoiceSearchWrapper } from './AlgoliaComponent.style';
import {
  VoiceSearchMicIcon,
  VoiceSearchStopIcon,
} from '@iso/config/icon.config';

const propTypes = {
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool,
};
const options = {
  autoStart: false,
};
function VoiceRecognition() {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [listening, setListening] = useState(false);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }
  return (
    <VoiceSearchWrapper className="isoVoiceSearch">
      {!listening ? (
        <div className="isoVoiceSearchStart">
          <button
            onClick={() => {
              SpeechRecognition.startListening();
              setListening(true);
            }}
          >
            <VoiceSearchMicIcon size={17} />
          </button>
          <span>Start Speaking</span>
        </div>
      ) : (
        <div className="isoVoiceSearchRunning">
          <button
            onClick={() => {
              // SpeechRecognition.setVoice(transcript);
              resetTranscript();
              SpeechRecognition.stopListening();
              setListening(false);
            }}
          >
            <VoiceSearchStopIcon sie={17} />
          </button>
          {/* <span>Search</span> */}
          <span>{transcript}</span>
        </div>
      )}
    </VoiceSearchWrapper>
  );
}
VoiceRecognition.propTypes = propTypes;
export default VoiceRecognition;
