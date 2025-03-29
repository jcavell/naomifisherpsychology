create table public."Webinars"
(
    webinar_id         bigint                   not null,
    created_at         timestamp with time zone not null default now(),
    zoom_meeting_id    bigint                   not null,
    webinar_name       character varying        not null,
    recorded_ticket_id bigint                   not null,
    zoom_account_name public.account_type not null default 'naomi'::account_type,
    constraint webinar_pkey primary key (webinar_id),
    constraint webinar_webinar_id_key unique (webinar_id)
) TABLESPACE pg_default;