import FormData from 'form-data';
import fetch, { Response } from 'node-fetch';

const baseUrl = 'https://adventofcode.com';

interface IPuzzleDay {
    year: number;
    day: number;
}

interface IAuthData {
    cookie: string;
}

interface IPuzzleAnswer extends IPuzzleDay {
    part: 1 | 2;
    answer: unknown;
}

type ResponseWithNonNullBody = Response & { body: NodeJS.ReadableStream };

const getCalendarUrl = (year: number) => `${baseUrl}/${year}`;
const getDayUrl = ({ year, day }: IPuzzleDay) => `${getCalendarUrl(year)}/day/${day}`;
const getInputUrl = (puzzle: IPuzzleDay) => `${getDayUrl(puzzle)}/input`;
const getAnswerUrl = (puzzle: IPuzzleDay) => `${getDayUrl(puzzle)}/answer`;

const getHeaders = ({ cookie }: IAuthData) => ({
    cookie
});

export const downloadInput = async (puzzle: IPuzzleDay, auth: IAuthData): Promise<ResponseWithNonNullBody> => {
    const inputUrl = getInputUrl(puzzle);
    const response = await fetch(inputUrl, { headers: getHeaders(auth) });
    if (!response.body) {
        throw new Error('No body');
    }
    return response;
};

export const submitAnswer = async (answerData: IPuzzleAnswer, auth: IAuthData) => {
    const answerUrl = getAnswerUrl(answerData);

    const answerFormData = new FormData();
    answerFormData.append('level', answerData.part.toString());
    answerFormData.append('answer', answerData.answer);

    return await fetch(answerUrl, {
        method:  'POST',
        headers: { ...getHeaders(auth), 'Content-Type': 'multipart/form-data' },
        body:    answerFormData.getBuffer()
    });
};