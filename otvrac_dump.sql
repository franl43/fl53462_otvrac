--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Ubuntu 15.4-2.pgdg22.04+1)
-- Dumped by pg_dump version 16.0 (Ubuntu 16.0-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: car; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.car (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    brand_id integer,
    price_euro numeric NOT NULL
);


ALTER TABLE public.car OWNER TO postgres;

--
-- Name: car_brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.car_brand (
    id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.car_brand OWNER TO postgres;

--
-- Name: car_brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.car_brand_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.car_brand_id_seq OWNER TO postgres;

--
-- Name: car_brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.car_brand_id_seq OWNED BY public.car_brand.id;


--
-- Name: car_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.car_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.car_id_seq OWNER TO postgres;

--
-- Name: car_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.car_id_seq OWNED BY public.car.id;


--
-- Name: dealership; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dealership (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    phone_number character varying(20),
    email character varying(100),
    address character varying(200) NOT NULL
);


ALTER TABLE public.dealership OWNER TO postgres;

--
-- Name: dealership_car; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dealership_car (
    dealership_id integer NOT NULL,
    car_id integer NOT NULL
);


ALTER TABLE public.dealership_car OWNER TO postgres;

--
-- Name: dealership_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dealership_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dealership_id_seq OWNER TO postgres;

--
-- Name: dealership_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dealership_id_seq OWNED BY public.dealership.id;


--
-- Name: dealership_working_hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dealership_working_hours (
    dealership_id integer NOT NULL,
    working_hours_id integer NOT NULL
);


ALTER TABLE public.dealership_working_hours OWNER TO postgres;

--
-- Name: working_hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.working_hours (
    id integer NOT NULL,
    days character varying(200) NOT NULL,
    open_time time without time zone,
    closing_time time without time zone
);


ALTER TABLE public.working_hours OWNER TO postgres;

--
-- Name: working_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.working_hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.working_hours_id_seq OWNER TO postgres;

--
-- Name: working_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.working_hours_id_seq OWNED BY public.working_hours.id;


--
-- Name: car id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car ALTER COLUMN id SET DEFAULT nextval('public.car_id_seq'::regclass);


--
-- Name: car_brand id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car_brand ALTER COLUMN id SET DEFAULT nextval('public.car_brand_id_seq'::regclass);


--
-- Name: dealership id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealership ALTER COLUMN id SET DEFAULT nextval('public.dealership_id_seq'::regclass);


--
-- Name: working_hours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.working_hours ALTER COLUMN id SET DEFAULT nextval('public.working_hours_id_seq'::regclass);


--
-- Data for Name: car; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.car (id, name, brand_id, price_euro) FROM stdin;
1	Golf 8	4	27453.56
2	Arteon	4	41476.42
3	A3	2	26591.00
4	e-tron GT	2	114538.00
5	RS 7 Sportback	2	90340.00
6	X4 M	1	90340.00
7	8 Series Gran Coupe	1	90340.00
8	Megane	5	25790.00
9	Clio 5	5	16790.00
10	C-Class	3	71300.00
\.


--
-- Data for Name: car_brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.car_brand (id, name) FROM stdin;
1	BMW
2	Audi
3	Mercedes-Benz
4	Volkswagen
5	Renault
\.


--
-- Data for Name: dealership; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dealership (id, name, phone_number, email, address) FROM stdin;
1	AS Centar Automobili	+385 99 600 1741	info@as-centar.hr	Samoborska cesta 233, 10000, Zagreb
2	Auto Pleter d.o.o.	+385 99 617 1333	autopleter@autopleter.hr	Bednjanska ul. 2, 10000, Zagreb
3	Info Max Cars d.o.o	+385 95 527 5550	info@maxcars.hr	Lanište 26, 10020, Zagreb
4	DaCar automobili	+385 1 388 8866	info@dacar.hr	Ul. Roberta Frangeša Mihanovića 11, 10000, Zagreb
5	Auto salon Ivic Cars	+385 92 326 8802	\N	Samoborska cesta 241, 10000, Zagreb
6	Auto Centar Roca d.o.o	+385 1 619 4140	info@roca.hr	Zagrebačka avenija 1, 10000, Zagreb
7	GT Automobili d.o.o	+385 1 622 7270	gt-automobili@gt-automobili.hr	Martićeva ul. 71, 10000, Zagreb
8	Tehel Automobili	+385 91 255 5888	info@tehel.hr	Radnička cesta 184, 10000, Zagreb
9	Autoto	+385 95 4445 300	info@autoto.hr	Ljubljanska avenija 4, 10090, Zagreb
10	Autoland	+385 98 278 465	tomislav.landeka@gmail.com	Ul. Vijenac Frane Gotovca, 10000, Zagreb
\.


--
-- Data for Name: dealership_car; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dealership_car (dealership_id, car_id) FROM stdin;
1	3
1	5
1	8
1	10
2	1
2	2
2	10
3	4
3	5
3	6
3	7
4	1
4	6
4	7
5	1
5	3
5	4
5	9
6	1
6	2
6	8
6	9
7	1
7	2
7	7
7	8
8	1
8	3
8	8
8	9
9	2
9	3
9	4
9	10
10	4
10	7
10	10
\.


--
-- Data for Name: dealership_working_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dealership_working_hours (dealership_id, working_hours_id) FROM stdin;
1	1
1	2
1	3
2	4
2	2
2	3
3	1
3	5
3	3
4	6
4	2
4	3
5	6
5	2
5	3
6	7
6	8
6	3
7	4
7	9
7	3
8	6
8	5
8	3
9	10
9	8
9	3
10	1
10	5
10	3
\.


--
-- Data for Name: working_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.working_hours (id, days, open_time, closing_time) FROM stdin;
1	MON-FRI	09:00:00	17:00:00
2	SAT	09:00:00	14:00:00
3	SUN	\N	\N
4	MON-FRI	08:00:00	17:00:00
5	SAT	09:00:00	13:00:00
6	MON-FRI	09:00:00	18:00:00
7	MON-FRI	07:00:00	21:00:00
8	SAT	08:00:00	13:00:00
9	SAT	08:30:00	13:00:00
10	MON-FRI	08:00:00	18:00:00
\.


--
-- Name: car_brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.car_brand_id_seq', 5, true);


--
-- Name: car_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.car_id_seq', 10, true);


--
-- Name: dealership_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dealership_id_seq', 10, true);


--
-- Name: working_hours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.working_hours_id_seq', 10, true);


--
-- Name: car_brand car_brand_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car_brand
    ADD CONSTRAINT car_brand_name_key UNIQUE (name);


--
-- Name: car_brand car_brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car_brand
    ADD CONSTRAINT car_brand_pkey PRIMARY KEY (id);


--
-- Name: car car_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car
    ADD CONSTRAINT car_pkey PRIMARY KEY (id);


--
-- Name: dealership_car dealership_car_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealership_car
    ADD CONSTRAINT dealership_car_pkey PRIMARY KEY (dealership_id, car_id);


--
-- Name: dealership dealership_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealership
    ADD CONSTRAINT dealership_pkey PRIMARY KEY (id);


--
-- Name: dealership_working_hours dealership_working_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealership_working_hours
    ADD CONSTRAINT dealership_working_hours_pkey PRIMARY KEY (dealership_id, working_hours_id);


--
-- Name: working_hours working_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.working_hours
    ADD CONSTRAINT working_hours_pkey PRIMARY KEY (id);


--
-- Name: car car_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car
    ADD CONSTRAINT car_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.car_brand(id);


--
-- Name: dealership_car fk_car; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealership_car
    ADD CONSTRAINT fk_car FOREIGN KEY (car_id) REFERENCES public.car(id);


--
-- Name: dealership_working_hours fk_dealership; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealership_working_hours
    ADD CONSTRAINT fk_dealership FOREIGN KEY (dealership_id) REFERENCES public.dealership(id);


--
-- Name: dealership_car fk_dealership; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealership_car
    ADD CONSTRAINT fk_dealership FOREIGN KEY (dealership_id) REFERENCES public.dealership(id);


--
-- Name: dealership_working_hours fk_working_hours; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dealership_working_hours
    ADD CONSTRAINT fk_working_hours FOREIGN KEY (working_hours_id) REFERENCES public.working_hours(id);


--
-- PostgreSQL database dump complete
--

