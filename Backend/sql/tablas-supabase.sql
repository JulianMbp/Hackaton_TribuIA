-- ===========================================
-- EMPRESAS
-- ===========================================
create table empresas (
    id uuid primary key default gen_random_uuid(),
    nombre varchar(255) not null,
    sector varchar(255),
    descripcion text,
    email varchar(255) unique not null,
    password varchar(255) not null,
    telefono varchar(50),
    pais varchar(100),
    ciudad varchar(100),
    direccion varchar(255),
    
    -- Información adicional de la empresa
    vision text,
    mision text,
    valores text,
    sitio_web varchar(500),
    logo_url varchar(500),
    linkedin_url varchar(500),
    anios_operacion int,
    numero_empleados int,
    
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- ===========================================
-- CANDIDATOS
-- ===========================================
create table candidatos (
    id uuid primary key default gen_random_uuid(),
    
    -- Se eliminó la referencia a empresa_id
    
    nombre varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    telefono varchar(50),
    pais varchar(100),
    ciudad varchar(100),

    experiencia_anios int,
    educacion varchar(255),
    skills text,
    cargo_aplicado varchar(255),

    portafolio_url varchar(500),
    github_url varchar(500),
    descripcion text,

    created_at timestamptz default now()
);

-- ===========================================
-- CVS
-- ===========================================
create table cvs (
    id uuid primary key default gen_random_uuid(),
    candidato_id uuid references candidatos(id) on delete cascade,
    url_archivo varchar(500) not null,
    texto_extraido text,
    formato varchar(50),
    peso_archivo numeric(10,2),
    uploaded_at timestamptz default now()
);

-- ===========================================
-- CARGOS
-- ===========================================
create table cargos (
    id uuid primary key default gen_random_uuid(),
    empresa_id uuid references empresas(id) on delete cascade,

    nombre varchar(255) not null,
    descripcion text,
    salario_min numeric(12,2),
    salario_max numeric(12,2),
    modalidad varchar(100), -- remoto | híbrido | presencial
    skills_requeridos text,
    nivel_experiencia varchar(100), -- junior | middle | senior
    estado varchar(50) default 'activo', -- activo | cerrado | pausado

    created_at timestamptz default now()
);

-- ===========================================
-- ENTREVISTAS
-- ===========================================
create table entrevistas (
    id uuid primary key default gen_random_uuid(),
    candidato_id uuid references candidatos(id) on delete cascade,
    cargo_id uuid references cargos(id) on delete cascade,

    estado varchar(50), -- pendiente | en_proceso | finalizada
    metodo varchar(100), -- IA | humano | mixto
    puntaje_final numeric(5,2),

    started_at timestamptz,
    finished_at timestamptz
);

-- ===========================================
-- PREGUNTAS
-- ===========================================
create table preguntas (
    id uuid primary key default gen_random_uuid(),
    entrevista_id uuid references entrevistas(id) on delete cascade,

    tipo varchar(100), -- técnica | comportamental | IA
    contenido text not null,
    generada_por varchar(50), -- ia | manual

    created_at timestamptz default now()
);

-- ===========================================
-- RESPUESTAS
-- ===========================================
create table respuestas (
    id uuid primary key default gen_random_uuid(),
    pregunta_id uuid references preguntas(id) on delete cascade,

    contenido text,
    tipo varchar(50), -- texto | audio | url_video

    created_at timestamptz default now()
);

-- ===========================================
-- PUNTAJES
-- ===========================================
create table puntajes (
    id uuid primary key default gen_random_uuid(),
    entrevista_id uuid references entrevistas(id) on delete cascade,
    criterio varchar(255),
    valor numeric(5,2)
);

-- ===========================================
-- HISTORIAL DE APLICACIONES
-- ===========================================
create table historial_aplicaciones (
    id uuid primary key default gen_random_uuid(),
    candidato_id uuid references candidatos(id) on delete cascade,
    cargo_id uuid references cargos(id) on delete cascade,

    estado varchar(50), -- aplicado | revisado | rechazado | contratado
    fecha timestamptz default now()
);

-- ===========================================
-- NOTIFICACIONES
-- ===========================================
create table notificaciones (
    id uuid primary key default gen_random_uuid(),

    usuario_id uuid not null,
    tipo_usuario varchar(50), -- empresa | candidato

    mensaje text not null,
    leido boolean default false,

    created_at timestamptz default now()
);