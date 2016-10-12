import sys, json
import music21
from music21 import *

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def mash(song1, song2):
	s = music21.stream.Score(id='mainScore')
	#s2Parts = song2.getElementsByClass('Part')
	s.insert(0, song2.parts[1])
	s.insert(0, song1.parts[0])
	return s

def main():
    #get our data as an array from read_in()
    lines = read_in()

    song1_path = lines.get(u'song1')
    song2_path = lines.get(u'song2')
    destination = lines.get(u'destination')
    song1_parsed = music21.converter.parse(song1_path)
    song2_parsed = music21.converter.parse(song2_path)
    mashed = mash(song1_parsed,song2_parsed)
    SubConverter = music21.converter.subConverters.ConverterMidi()
    midi = SubConverter.write(mashed, 'mid', destination)

    #print midi

#start process
if __name__ == '__main__':
    main()

# to test run: cat pytest.txt | python mashup.py